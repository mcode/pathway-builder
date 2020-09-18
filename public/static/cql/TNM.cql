library "TNM" version '1.0.0'

using FHIR version '4.0.0'

include "FHIRHelpers" version '4.0.0' called FHIRHelpers

codesystem "LOINC": 'http://loinc.org'
codesystem "SNOMEDCT": 'http://snomed.info/sct'

// LOINC Observation Codes
code "Primary tumor.clinical [Class] Cancer code": '21905-5' from "LOINC" display 'Primary tumor.clinical [Class] Cancer'
code "Regional lymph nodes.clinical [Class] Cancer code": '21906-3' from "LOINC" display 'Regional lymph nodes.clinical [Class] Cancer'

// SNOMED Observation Values
code "T0 category (finding) code": '58790005' from "SNOMEDCT" display 'T0 category (finding)'
code "T1 category (finding) code": '23351008' from "SNOMEDCT" display 'T1 category (finding)'
code "T2 category (finding) code": '67673008' from "SNOMEDCT" display 'T2 category (finding)'
code "T3 category (finding) code": '14410001' from "SNOMEDCT" display 'T3 category (finding)'
code "T4 category (finding) code": '65565005' from "SNOMEDCT" display 'T4 category (finding)'
code "N0 category (finding) code": '62455006' from "SNOMEDCT" display 'N0 category (finding)'
code "N1 category (finding) code": '53623008' from "SNOMEDCT" display 'N1 category (finding)'
code "N2 category (finding) code": '46059003' from "SNOMEDCT" display 'N2 category (finding)'
code "N3 category (finding) code": '5856006' from "SNOMEDCT" display 'N3 category (finding)'

// FHIR CONCEPTS

// Observations
concept "T0 category (finding)": {"T0 category (finding) code"} display 'T0 category (finding)'
concept "T1 category (finding)": {"T1 category (finding) code"} display 'T1 category (finding)'
concept "T2 category (finding)": {"T2 category (finding) code"} display 'T2 category (finding)'
concept "T3 category (finding)": {"T3 category (finding) code"} display 'T3 category (finding)'
concept "T4 category (finding)": {"T4 category (finding) code"} display 'T4 category (finding)'
concept "N0 category (finding)": {"N0 category (finding) code"} display 'N0 category (finding)'
concept "N1 category (finding)": {"N1 category (finding) code"} display 'N1 category (finding)'
concept "N2 category (finding)": {"N2 category (finding) code"} display 'N2 category (finding)'
concept "N3 category (finding)": {"N3 category (finding) code"} display 'N3 category (finding)'

context Patient

define "N0":
  exists(
    [Observation: "Regional lymph nodes.clinical [Class] Cancer code"] N0
      where FHIRHelpers.ToConcept(N0.value as FHIR.CodeableConcept) ~ "N0 category (finding)"
  )

define "N+":
  exists(
    [Observation: "Regional lymph nodes.clinical [Class] Cancer code"] NLarge
      where FHIRHelpers.ToConcept(NLarge.value as FHIR.CodeableConcept) ~ "N1 category (finding)"
        or FHIRHelpers.ToConcept(NLarge.value as FHIR.CodeableConcept) ~ "N2 category (finding)"
        or FHIRHelpers.ToConcept(NLarge.value as FHIR.CodeableConcept) ~ "N3 category (finding)"
  )

define "T > 2cm":
  exists(
    [Observation: "Primary tumor.clinical [Class] Cancer code"] TLarge
      where FHIRHelpers.ToConcept(TLarge.value as FHIR.CodeableConcept) ~ "T2 category (finding)"
        or FHIRHelpers.ToConcept(TLarge.value as FHIR.CodeableConcept) ~ "T3 category (finding)"
  )

define "T <= 2cm":
  exists(
    [Observation: "Primary tumor.clinical [Class] Cancer code"] TSmall
      where FHIRHelpers.ToConcept(TSmall.value as FHIR.CodeableConcept) ~ "T0 category (finding)"
        or FHIRHelpers.ToConcept(TSmall.value as FHIR.CodeableConcept) ~ "T1 category (finding)"
  )

define "T > 2":
  exists(
    [Observation: "Primary tumor.clinical [Class] Cancer code"] TLarge
      where FHIRHelpers.ToConcept(TLarge.value as FHIR.CodeableConcept) ~ "T3 category (finding)"
        or FHIRHelpers.ToConcept(TLarge.value as FHIR.CodeableConcept) ~ "T4 category (finding)"
  )

define "T <= 2":
  exists(
    [Observation: "Primary tumor.clinical [Class] Cancer code"] TSmall
      where FHIRHelpers.ToConcept(TSmall.value as FHIR.CodeableConcept) ~ "T0 category (finding)"
        or FHIRHelpers.ToConcept(TSmall.value as FHIR.CodeableConcept) ~ "T1 category (finding)"
        or FHIRHelpers.ToConcept(TSmall.value as FHIR.CodeableConcept) ~ "T2 category (finding)"
  )
