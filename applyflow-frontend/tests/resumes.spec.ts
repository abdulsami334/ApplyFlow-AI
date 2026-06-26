import { expect, test } from "@playwright/test";

const user = {
  id: "5f41c77d-72a5-48c5-b987-b756ce25ac68",
  email: "resume.user@example.com",
  createdAt: "2026-06-25T12:00:00.000Z",
};

const existingResume = {
  id: "94a03a29-6bc4-4f37-a081-773e9a3f53c1",
  userId: user.id,
  fileName: "software-engineer.pdf",
  contentType: "application/pdf",
  fileSize: 248000,
  uploadedAt: "2026-06-25T12:00:00.000Z",
};

const application = {
  id: "7ebc89ea-2cd2-44a4-a8de-f962f22ce64c",
  userId: user.id,
  companyName: "OpenAI",
  positionTitle: "Full Stack Engineer",
  applicationDate: "2026-06-25T12:00:00.000Z",
  status: "Applied",
  location: "Remote",
  jobType: "Full-time",
  workMode: "Remote",
  source: "LinkedIn",
  salaryRange: null,
  contactName: null,
  contactEmail: null,
  jobUrl: null,
  followUpDate: null,
  notes: "Strong product engineering role.",
  createdAt: "2026-06-25T12:00:00.000Z",
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(({ currentUser }) => {
    window.localStorage.setItem(
      "applyflow.auth",
      JSON.stringify({ token: "test-token", user: currentUser }),
    );
  }, { currentUser: user });

  await page.route("**/api/users/me", async (route) => {
    await route.fulfill({ json: user });
  });
});

test("shows the resume library page and empty state", async ({ page }) => {
  await page.route("**/api/resumes**", async (route) => {
    await route.fulfill({ json: [] });
  });

  await page.goto("/resumes");

  await expect(page.getByRole("heading", { name: "Resumes" })).toBeVisible();
  await expect(page.getByLabel("Upload resume")).toBeVisible();
  await expect(page.getByText("No resumes yet")).toBeVisible();
  await expect(page.getByRole("link", { name: "Resumes" })).toBeVisible();
});

test("uploads a resume and adds it to the library", async ({ page }) => {
  await page.route("**/api/resumes**", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: [] });
      return;
    }

    await route.fulfill({
      status: 201,
      json: {
        ...existingResume,
        id: "d88b4d67-b6c4-49f5-bdb4-466c95c51347",
        fileName: "new-resume.pdf",
        fileSize: 17,
      },
    });
  });

  await page.goto("/resumes");
  await page.getByLabel("Upload resume").setInputFiles({
    name: "new-resume.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 resume"),
  });
  await page.getByTestId("upload-resume-submit").click();

  await expect(page.getByText("new-resume.pdf")).toBeVisible();
  await expect(page.getByText("No resumes yet")).toBeHidden();
});

test("lists and deletes resumes", async ({ page }) => {
  let resumes = [existingResume];

  await page.route(`**/api/resumes/${existingResume.id}`, async (route) => {
    resumes = [];
    await route.fulfill({ status: 204 });
  });
  await page.route("**/api/resumes**", async (route) => {
    await route.fulfill({ json: resumes });
  });

  await page.goto("/resumes");
  await expect(page.getByText(existingResume.fileName)).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).click();

  await expect(page.getByText(existingResume.fileName)).toBeHidden();
  await expect(page.getByText("No resumes yet")).toBeVisible();
});

test("application detail page renders match workspace and result UI", async ({ page }) => {
  await page.route(`**/api/applications/${application.id}`, async (route) => {
    await route.fulfill({ json: application });
  });
  await page.route(`**/api/applications/${application.id}/job-description`, async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ status: 404, json: { message: "Job description not found." } });
      return;
    }

    await route.fulfill({
      status: route.request().method() === "POST" ? 201 : 200,
      json: {
        id: "5391172a-39ca-4818-8716-d4414cc82aa9",
        userId: user.id,
        applicationId: application.id,
        rawText: "React TypeScript API PostgreSQL",
        createdAt: "2026-06-25T12:00:00.000Z",
        updatedAt: "2026-06-25T12:00:00.000Z",
      },
    });
  });
  await page.route(`**/api/applications/${application.id}/match-analysis`, async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ status: 404, json: { message: "Match analysis not found." } });
      return;
    }

    await route.fulfill({
      status: 201,
      json: {
        id: "84a51026-08a0-4b23-894f-1e22ba8f2e45",
        userId: user.id,
        applicationId: application.id,
        resumeId: existingResume.id,
        jobDescriptionId: "5391172a-39ca-4818-8716-d4414cc82aa9",
        matchScore: 75,
        matchedKeywords: ["react", "api", "postgresql"],
        missingKeywords: ["typescript"],
        suggestions: ["Consider adding evidence for 'typescript' if it matches your real experience."],
        warning: null,
        createdAt: "2026-06-25T12:00:00.000Z",
      },
    });
  });
  await page.route("**/api/resumes**", async (route) => {
    await route.fulfill({ json: [existingResume] });
  });

  await page.goto(`/applications/${application.id}`);

  await expect(page.getByRole("heading", { name: application.positionTitle })).toBeVisible();
  await expect(page.getByLabel("Job description")).toBeVisible();
  await expect(page.getByLabel("Resume")).toBeVisible();
  await expect(page.getByRole("button", { name: "Analyze Match" })).toBeVisible();

  await page.getByLabel("Job description").fill("React TypeScript API PostgreSQL");
  await page.getByLabel("Resume").selectOption(existingResume.id);
  await page.getByRole("button", { name: "Analyze Match" }).click();

  await expect(page.getByText("75%")).toBeVisible();
  await expect(page.getByText("react", { exact: true })).toBeVisible();
  await expect(page.getByText("typescript", { exact: true })).toBeVisible();
  await expect(page.getByText(/Consider adding evidence/)).toBeVisible();
});
