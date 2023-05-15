FROM mcr.microsoft.com/dotnet/sdk:7.0-bullseye-slim AS build

WORKDIR .
COPY ["Askebakken.GraphQL/Askebakken.GraphQL.csproj", "Askebakken.GraphQL/"]

RUN dotnet restore "Askebakken.GraphQL/Askebakken.GraphQL.csproj"
COPY . .
RUN dotnet build "Askebakken.GraphQL/Askebakken.GraphQL.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Askebakken.GraphQL/Askebakken.GraphQL.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0-bullseye-slim AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 5132
ENTRYPOINT ["dotnet", "Askebakken.GraphQL.dll"]