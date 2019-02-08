# RDS Whitepaper

Introduction:

- Towards complete scientific publications that contain all methods and data (see DAR).
- Classical user interfaces, word processor like Microsoft Word, a spread sheet
  interface like Microsoft Excel, and means to use content across different pieces,
  so called transclusions (see Stencila)
- Dynamic content backed by programs can be revealed in a progressive way (see Progressive Enhancement)
- In this white-paper we present a concept that we have developed as part of
  Stencila and the Reproducible Document Stack.

Requirements

- TODO: collect requirements for the system by reverse-engineering the current
  implementation in

- Proposal
  - Requirements: UI, Engine, Backend
  - Cell States
  - Cell Graph
  - Engine / Scheduler
  - Algorithms
- Prototype (based on Texture)
- Outlook

TODO:
- collect requirements (UI, Engine, Backend)

## Cell Graph

TODO:
- motivation: what is the idea? what the exact purpose?
- describe on a case-per-case basis, how Cell Graph needs to be updated
  - addCell()
  - removeCell()
  - setInputsOutputs()
  - addErrors()
  - clearErrors()
  - setValue()
- describe different cases of errors
  - syntax error
  - runtime error
  - cyclic dependency
  - variable re-definition

## Engine / Scheduler

TODO:
- motivation: requirements, constraints, challenges

## User Interface

### Advanced Topics

#### Code Assist

- Function help
- more?

#### Error Handling

