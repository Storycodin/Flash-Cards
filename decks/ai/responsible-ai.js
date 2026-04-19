// ─────────────────────────────────────────────
// Responsible AI Cards
// Source: developers.google.com/machine-learning/glossary/responsible-ai
// ─────────────────────────────────────────────
const RESPONSIBLE_AI = [
  {
    term: "automation bias",
    category: "responsible AI",
    definition: "When a human decision maker favors recommendations made by an automated decision-making system over information made without automation — even when the automated system makes errors. A form of over-trust in AI outputs."
  },
  {
    term: "bias (ethics/fairness)",
    category: "responsible AI",
    definition: "Stereotyping, prejudice, or favoritism toward some things, people, or groups. Can affect data collection, system design, and user interaction. Distinct from the mathematical 'bias' term in ML models. Types include automation bias, confirmation bias, implicit bias, selection bias, and reporting bias."
  },
  {
    term: "confirmation bias",
    category: "responsible AI",
    definition: "The tendency to search for, interpret, favor, and recall information in ways that confirm pre-existing beliefs. ML developers may inadvertently collect or label data to support existing hypotheses. <strong>Experimenter's bias</strong> is a form of confirmation bias where a developer trains models until a pre-existing hypothesis is confirmed."
  },
  {
    term: "counterfactual fairness",
    category: "responsible AI · metrics",
    definition: "A fairness metric checking whether a classification model produces the same result for one individual as for another who is identical except for one or more sensitive attributes. One method for surfacing potential sources of bias in a model."
  },
  {
    term: "demographic parity",
    category: "responsible AI · metrics",
    definition: "A fairness metric satisfied when classification results are not dependent on a given sensitive attribute. For example, if the percentage of Lilliputians admitted to a university equals the percentage of Brobdingnagians — regardless of average qualification differences."
  },
  {
    term: "disparate impact",
    category: "responsible AI",
    definition: "When an algorithmic decision-making process harms or benefits some population subgroups more than others, even without explicitly using sensitive attributes as inputs. Contrast with disparate treatment, which involves explicitly using sensitive attributes."
  },
  {
    term: "disparate treatment",
    category: "responsible AI",
    definition: "Factoring subjects' sensitive attributes into an algorithmic decision-making process such that different subgroups of people are treated differently. Warning: removing sensitive attributes from data doesn't guarantee equal treatment if proxy features (like postal code) remain."
  },
  {
    term: "equality of opportunity",
    category: "responsible AI · metrics",
    definition: "A fairness metric satisfied when the true positive rate is the same for all groups defined by a sensitive attribute — meaning the model predicts the desirable outcome equally well for all groups. Related to but less strict than equalized odds."
  },
  {
    term: "equalized odds",
    category: "responsible AI · metrics",
    definition: "A fairness metric satisfied when both the true positive rate and the false negative rate are the same for all groups. Stricter than equality of opportunity, which only checks the positive class. Note: equalized odds can be satisfied while demographic parity is not."
  },
  {
    term: "fairness constraint",
    category: "responsible AI",
    definition: "Applying a constraint to an algorithm to ensure one or more definitions of fairness are satisfied. Methods include post-processing model output, adding a fairness penalty to the loss function, or adding a mathematical constraint directly to the optimization problem."
  },
  {
    term: "fairness metric",
    category: "responsible AI · metrics",
    definition: "A mathematical definition of 'fairness' that is measurable. Common examples include equalized odds, predictive parity, counterfactual fairness, and demographic parity. Many fairness metrics are mutually exclusive — no single universal metric applies to all ML problems."
  },
  {
    term: "group attribution bias",
    category: "responsible AI",
    definition: "Assuming that what is true for an individual is also true for everyone in that group. Can be worsened by convenience sampling. Includes in-group bias (partiality toward one's own group) and out-group homogeneity bias (seeing out-group members as more alike than they are)."
  },
  {
    term: "historical bias",
    category: "responsible AI",
    definition: "Bias that already exists in the world and has made its way into a dataset — often reflecting existing cultural stereotypes, demographic inequalities, and prejudices. For example, a loan model trained on 1980s data may perpetuate historical lending discrimination even if conditions have changed."
  },
  {
    term: "implicit bias",
    category: "responsible AI",
    definition: "Automatically making an association or assumption based on mental models and memories, without conscious awareness. Can affect how data is collected and classified, and how ML systems are designed. For example, assuming white dresses indicate wedding photos in all cultures."
  },
  {
    term: "incompatibility of fairness metrics",
    category: "responsible AI · metrics",
    definition: "The principle that some notions of fairness are mutually incompatible and cannot all be satisfied simultaneously. Fairness must therefore be defined contextually for each ML problem. This doesn't render fairness efforts fruitless — tradeoffs must simply be acknowledged."
  },
  {
    term: "in-group bias",
    category: "responsible AI",
    definition: "Showing partiality to one's own group or characteristics. If testers or raters consist of the ML developer's friends or colleagues, in-group bias may invalidate product testing or the dataset. A form of group attribution bias."
  },
  {
    term: "individual fairness",
    category: "responsible AI · metrics",
    definition: "A fairness metric that checks whether similar individuals are classified similarly. Entirely dependent on how 'similarity' is defined — a poor similarity metric can introduce new fairness problems rather than solving them."
  },
  {
    term: "out-group homogeneity bias",
    category: "responsible AI",
    definition: "The tendency to see out-group members as more alike than in-group members. For example, Lilliputians might describe other Lilliputians' houses in great architectural detail, but simply say Brobdingnagians all live in identical houses. A form of group attribution bias."
  },
  {
    term: "post-processing",
    category: "responsible AI",
    definition: "Adjusting the output of a model <em>after</em> it runs, without modifying the model itself. Can enforce fairness constraints — for example, setting a classification threshold such that the true positive rate is equal across all values of a sensitive attribute."
  },
  {
    term: "predictive parity",
    category: "responsible AI · metrics",
    definition: "A fairness metric that checks whether precision rates are equivalent across subgroups under consideration. For example, a college admission model satisfies predictive parity for nationality if its precision rate is the same for Lilliputians and Brobdingnagians."
  },
  {
    term: "preprocessing (fairness)",
    category: "responsible AI",
    definition: "Processing data before model training to reduce bias. Can range from removing out-of-vocabulary words to re-expressing data points to eliminate attributes correlated with sensitive attributes. Can help satisfy fairness constraints."
  },
  {
    term: "proxy (sensitive attributes)",
    category: "responsible AI",
    definition: "An attribute used as a stand-in for a sensitive attribute. For example, postal code might be used as a proxy for income, race, or ethnicity. Proxy features can cause disparate impact even when sensitive attributes are explicitly removed from training data."
  },
  {
    term: "reporting bias",
    category: "responsible AI",
    definition: "The fact that the frequency with which people write about actions, outcomes, or properties does not reflect their real-world frequencies. For example, books mention 'laughed' far more than 'breathed', which would mislead a model estimating their relative frequencies."
  },
  {
    term: "selection bias",
    category: "responsible AI",
    definition: "Errors in conclusions drawn from data due to a selection process that creates systematic differences between observed and unobserved samples. Includes coverage bias (wrong population), sampling bias (non-random sampling), and non-response bias (certain groups opt out)."
  },
  {
    term: "sensitive attribute",
    category: "responsible AI",
    definition: "A human attribute that may be given special consideration for legal, ethical, social, or personal reasons — such as race, gender, age, nationality, or religion. Sensitive attributes are often protected by law and require careful handling in ML systems."
  },
  {
    term: "unawareness (to a sensitive attribute)",
    category: "responsible AI",
    definition: "A situation where sensitive attributes are present in the world but not included in training data. Because sensitive attributes are often correlated with other features, a model trained with this unawareness could still produce disparate impact or violate fairness constraints."
  }
];

export default RESPONSIBLE_AI;
