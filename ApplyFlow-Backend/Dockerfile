FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["ApplyFlow-Backend/ApplyFlow-Backend.csproj", "ApplyFlow-Backend/"]
RUN dotnet restore "ApplyFlow-Backend/ApplyFlow-Backend.csproj"

COPY . .
WORKDIR "/src/ApplyFlow-Backend"
RUN dotnet publish "ApplyFlow-Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ApplyFlow-Backend.dll"]
