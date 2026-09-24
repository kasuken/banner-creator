using './main.bicep'

param name = 'banner-creator'
param location = 'westeurope'
param publicSiteUrl = 'https://www.bannercreator.pro'

// Read from the environment at deploy time: set UNSPLASH_ACCESS_KEY before running az deployment
param unsplashAccessKey = readEnvironmentVariable('UNSPLASH_ACCESS_KEY', '')
