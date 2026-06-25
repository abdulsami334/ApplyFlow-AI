namespace ApplyFlow_Backend.Models
{
    public class Resume
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public byte[] FileContent { get; set; } = [];
        public DateTime UploadedAt { get; set; }
    }
}
