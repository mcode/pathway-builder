library "Tumor_Markers" version '1.0.0'

using FHIR version '4.0.1'

include "FHIRHelpers" version '4.0.1' called FHIRHelpers 

codesystem "LOINC": 'http://loinc.org' 
codesystem "SNOMED": 'http://snomed.info/sct' 


code "85337-4 code": '85337-4' from "LOINC"
  display 'Estrogen receptor Ag [Presence] in Breast cancer specimen by Immune stain'

code "HER2 [Presence] in Breast cancer specimen by Immune stain code": '85319-2' from "LOINC"
  display 'HER2 [Presence] in Breast cancer specimen by Immune stain'

code "85339-0 code": '85339-0' from "LOINC"
  display 'Progesterone receptor Ag [Presence] in Breast cancer specimen by Immune stain'

code "Positive (qualifier value) code": '10828004' from "SNOMED"
  display 'Positive (qualifier value)'

code "Negative (qualifier value) code": '260385009' from "SNOMED"
  display 'Negative (qualifier value)'



context Patient

define "ER Status":
  MostRecent([Observation: "85337-4 code"])

define "HER2 Status":
  MostRecent([Observation: "HER2 [Presence] in Breast cancer specimen by Immune stain code"])

define "PR Status":
  MostRecent([Observation: "85339-0 code"])

define "ER Positive":
  ConceptValue("ER Status") ~ "Positive (qualifier value) code"

define "ER Negative":
  ConceptValue("ER Status") ~ "Negative (qualifier value) code"

define "HER2 Positive":
  ConceptValue("HER2 Status") ~ "Positive (qualifier value) code"

define "HER2 Negative":
  ConceptValue("HER2 Status") ~ "Negative (qualifier value) code"

define "PR Positive":
  ConceptValue("PR Status") ~ "Positive (qualifier value) code"

define "PR Negative":
  ConceptValue("PR Status") ~ "Negative (qualifier value) code"

define "InPopulation":
  null

define "Recommendation": 
  if "InPopulation" then ''
  else null

define "Rationale":
  if "InPopulation" then null
  else null

define "Errors":
  null

/* Below migrated from to make this file self-contained */

/**
 * Extracts the CodeableConcept value from an Observation, returning it as a CQL Concept
 * @param Obs - an observation
 * @returns {System.Concept} the Observation's value as a concept, or null if there is no CodeabeConcept value
 */
define function ConceptValue(Obs Observation):
  FHIRHelpers.ToConcept(Obs.value as FHIR.CodeableConcept)


/**
 * The most recent observation.  For each Observation, this algorithm will use the Coalesce function, which uses the
 * first non-null date value from these fields: effectiveDateTime, effectiveInstant, effectivePeriod.end,
 * effectivePeriod.start, issued. The found date will be used to compare Observations and determine the most recent
 * one.  NOTE: We can't use FindDate because it appears that the execution engine may have problems sorting by the
 * result of a function.
 * @param ObsList - a list of Observations
 * @returns {Observation} the most recent Observation from the list, or null if null was passed in
 */
define function MostRecent(ObsList List<Observation>):
  Last(ObsList O sort by Coalesce(
    (effective as FHIR.dateTime).value,
    (effective as FHIR.instant).value,
    (effective as FHIR.Period)."end".value,
    (effective as FHIR.Period)."start".value,
    issued.value)
  )
