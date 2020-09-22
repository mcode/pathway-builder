library "Pathologic-Response" version '1.0.0'

using FHIR version '4.0.0'

include "FHIRHelpers" version '4.0.0' called FHIRHelpers

// CODESYSTEMS
codesystem "SNOMEDCT": 'http://snomed.info/sct'
codesystem "LOINC": 'http://loinc.org'

// LOINC Observation Codes
code "Pathologic response code": '88040-1' from "LOINC" display 'Pathologic response code'

// SNOMED Observation Values
code "Complete (qualifier value) code": '255594003' from "SNOMEDCT" display 'Complete (qualifier value)'
code "Partial (qualifier value) code": '255609007' from "SNOMEDCT" display 'Partial (qualifier value)'
code "Stable (qualifier value) code": '58158008' from "SNOMEDCT" display 'Stable (qualifier value)'
code "Progressive (qualifier value) code": '255314001' from "SNOMEDCT" display 'Progressive (qualifier value)'


// FHIR CONCEPTS

// Observations
concept "Complete (qualifier value)": {"Complete (qualifier value) code"} display 'Complete (qualifier value)'
concept "Partial": {"Partial (qualifier value) code"} display 'Partial (qualifier value)'
concept "Stable": {"Stable (qualifier value) code"} display 'Stable (qualifier value)'
concept "Progressive": {"Progressive (qualifier value) code"} display 'Progressive (qualifier value)'

context Patient

define "Complete":
  exists(
    [Observation: "Pathologic response code"] Response
      where FHIRHelpers.ToConcept(Response.value as FHIR.CodeableConcept) ~ "Complete (qualifier value)"
  )

define "Partial/Stable/Progressive":
  exists(
    [Observation: "Pathologic response code"] Response
      where FHIRHelpers.ToConcept(Response.value as FHIR.CodeableConcept) ~ "Partial"
        or FHIRHelpers.ToConcept(Response.value as FHIR.CodeableConcept) ~ "Stable"
        or FHIRHelpers.ToConcept(Response.value as FHIR.CodeableConcept) ~ "Progressive"
  )
