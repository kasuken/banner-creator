// Banner Creator: Azure Static Web App (Free tier) with managed Functions API (MCP server).
//
// The custom domain (www.bannercreator.pro) is bound with the Azure CLI rather than in this template, since the
// CNAME must resolve first and the customDomains PUT blocks the deployment until DNS validation completes.
// The apex bannercreator.pro is forwarded to www at the DNS provider (GoDaddy). See README "Deploy to Azure".

@description('Name of the Static Web App resource.')
param name string = 'banner-creator'

@description('Region for the Static Web App. Managed functions are available in: centralus, eastasia, eastus2, westeurope, westus2.')
@allowed([
  'centralus'
  'eastasia'
  'eastus2'
  'westeurope'
  'westus2'
])
param location string = 'westeurope'

@description('Public URL of the site, used by the MCP server for "edit in browser" links. Defaults to the azurestaticapps.net hostname.')
param publicSiteUrl string = ''

@secure()
@description('Unsplash access key used by the MCP server (search_background_images / render_banner).')
param unsplashAccessKey string = ''

resource staticSite 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    // Deployed from GitHub Actions with the deployment token, no repository link needed
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Enabled'
  }
}

resource appSettings 'Microsoft.Web/staticSites/config@2023-12-01' = {
  parent: staticSite
  name: 'appsettings'
  properties: {
    UNSPLASH_ACCESS_KEY: unsplashAccessKey
    PUBLIC_SITE_URL: empty(publicSiteUrl) ? 'https://${staticSite.properties.defaultHostname}' : publicSiteUrl
  }
}

output name string = staticSite.name
output defaultHostname string = staticSite.properties.defaultHostname
