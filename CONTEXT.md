# Sync Health

Telehealth for clinician-reviewed peptide care: the person requests care, a licensed clinician decides what (if anything) to prescribe, and a compounding pharmacy prepares and ships it.

## Language

**Protocol**:
A clinician's personalized prescription for one person — the compound(s), dose, and cycle decided for their body. An Order requests a Protocol; it does not guarantee one.
_Avoid_: Order (when meaning the prescription itself), purchase, stack (when meaning the clinical decision), product (when meaning the prescription)

**Category**:
A goal bucket used to browse offerings — Recovery, Performance, Metabolic, Weight, Skin & Longevity, Hormonal Health, Cognitive.
_Avoid_: Protocol (when meaning the bucket), lane, goal (as a nav/browse label)

**Compound**:
A single molecule offered for prescription — e.g. BPC-157, Sermorelin, NAD+.
_Avoid_: Protocol, product (when meaning the molecule itself), stack

**Stack**:
A named multi-compound offering sold as one catalog entry — e.g. REPAIR, PERFORM, DEFINE.
_Avoid_: Protocol, compound (when meaning the whole offering)

**Product**:
Anything with a product page and cart line: either a Compound or a Stack. A cart holds Products; a Protocol may prescribe them after clinical review.
_Avoid_: Protocol, order (when meaning the catalog entry itself)

**Quiz**:
The guided Q&A product that collects goals, history, and preferences before a clinician reviews. The interactive flow people take on `/quiz`.
_Avoid_: Assessment (as the product name), intake (when meaning the flow itself)

**Intake**:
The clinical record a clinician receives — answers and context gathered so they can decide whether to prescribe a Protocol. Produced by the Quiz (and related care request), not a separate product people browse to.
_Avoid_: Quiz (when meaning the submitted record), order, form

**Plan**:
A commercial price option on a Product — e.g. monthly vs multi-month, with period and savings labels. What the cart selects.
_Avoid_: Cycle, subscription (when a more specific Plan label exists), protocol duration

**Cycle**:
A clinical treatment period under a Protocol that a clinician revisits and may adjust. Cycle two is not cycle one.
_Avoid_: Plan, billing period, month (when meaning the clinical revisit, not the calendar)

**Formulary**:
The full Product browser — every offering in one place, filtered by Category and Tier (`/start`).
_Avoid_: Catalog (when meaning the full browser), shop, store

**Catalog**:
A marketing showcase of Products on the home page (slider / teaser), not the complete browse experience.
_Avoid_: Formulary (when meaning the home teaser)

**Tier**:
A complexity filter on the Formulary and Catalog: **Single** = one Compound; **Advanced** = Stacks (and denser regimens). Cross-cuts Category — e.g. Recovery can appear on both.
_Avoid_: Category, protocol level, metabolic/hormonal (as the definition of Advanced)

**Clinician**:
The licensed person who reviews an Intake and decides whether to prescribe a Protocol (and at what dose/cycle). Independent of SYNC as a platform.
_Avoid_: Physician (as the default word), doctor, provider (in product/UI language)

**Provider**:
Legal/ToS sense of the independent clinical party in the care relationship — not the everyday product word. Prefer Clinician in product language.
_Avoid_: Clinician (in legal text where Provider is the defined party)

**Member**:
The everyday product word for a person using SYNC — browsing, taking the Quiz, or on an active Protocol.
_Avoid_: Customer, user, client

**Patient**:
Clinical/legal/pharmacy contexts only — the named person a compounded medication is prepared for, and language in privacy/dashboard/HIPAA surfaces. Not the default marketing word.
_Avoid_: Member (in clinical/legal text where Patient is required)

**Order**:
What a Member submits at checkout — a commercial request for Products that a Clinician may turn into a Protocol. Payment may be authorized before approval; an Order is not itself a Protocol and may be declined.
_Avoid_: Protocol, purchase (as the success state), care request

**Journal**:
SYNC's editorial publication — physician-informed writing on Compounds, Protocols, and the research behind them. The home teaser and `/journal` are the same publication.
_Avoid_: Blog

**Article**:
One piece in the Journal.
_Avoid_: Post, blog post, story (when meaning editorial content)
