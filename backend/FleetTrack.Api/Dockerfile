FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

COPY FleetTrack.Api.csproj .

RUN dotnet restore

COPY . .

RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "FleetTrack.Api.dll"]