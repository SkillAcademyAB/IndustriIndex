# IndustriIndex

An index describing swedish counties and municipalities according to different industrial manufacturing dimensions.

- Manufacturing industry workforce as a percentage of the whole county or municipality total workforforce
- Industrial investments for county or municipality.
- Industrial potential - composite index:
  - Number of engineers
  - Number of technical trained from high school
  - Attractivenes of technical educations - high school and college
- Industrial diversification - number of industrial companies per capita or per manufactoring workforce persons. 


## Use Git Flow model - branch names
- `main` — production-ready code; release branches are created from here
- `develop` — integration/staging branch
- `feature/<ticket-id-or-short-description>` — feature branches off develop
- `release/<version>` — preparation for production release (branched from develop, merged into main and back into develop)
- `hotfix/<ticket-id-or-short-description>` — urgent fixes off main (merged into main and back into develop)
