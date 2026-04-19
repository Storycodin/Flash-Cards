// ─────────────────────────────────────────────
// Metrics Cards
// Source: developers.google.com/machine-learning/glossary/metrics
// ─────────────────────────────────────────────
const METRICS = [
  {
    term: "average precision at k",
    category: "metrics",
    definition: "A metric for summarizing a model's performance on a single prompt that generates ranked results. Calculated as the average of precision@k values for each <em>relevant</em> result in the list. Contrast with mean average precision at k (mAP@k), which averages across many prompts."
  },
  {
    term: "baseline",
    category: "metrics",
    definition: "A model used as a reference point for comparing how well another (typically more complex) model performs. For example, a logistic regression model might serve as a baseline for a deep model. Helps quantify the minimum expected performance a new model must exceed."
  },
  {
    term: "BLEU (Bilingual Evaluation Understudy)",
    category: "metrics",
    definition: "A precision-focused metric for evaluating machine translation quality by measuring N-gram overlap between generated text and reference text. Optimizes for precision (unlike ROUGE, which optimizes for recall), making it better suited for translation evaluation."
  },
  {
    term: "ChrF (Character N-gram F-score)",
    category: "metrics",
    definition: "A metric to evaluate machine translation models by measuring N-gram overlap between reference text and generated text. Similar to ROUGE and BLEU families, but operates on <em>character</em> N-grams rather than word N-grams or tokens."
  },
  {
    term: "counterfactual fairness",
    category: "metrics · responsible AI",
    definition: "A fairness metric that checks whether a classification model produces the same result for one individual as it does for another who is identical except for one or more sensitive attributes. One method for surfacing potential sources of bias."
  },
  {
    term: "cross-entropy",
    category: "metrics",
    definition: "A generalization of Log Loss to multi-class classification problems. Quantifies the difference between two probability distributions. A model's cross-entropy loss is lower when its predicted probabilities closely match the true class distribution."
  },
  {
    term: "demographic parity",
    category: "metrics · responsible AI",
    definition: "A fairness metric satisfied when a model's classification results are not dependent on a given sensitive attribute. For example, if the admission rate for Lilliputians equals the rate for Brobdingnagians, demographic parity is achieved — regardless of qualification differences."
  },
  {
    term: "earth mover's distance (EMD)",
    category: "metrics",
    definition: "A measure of the relative similarity of two distributions. The lower the EMD, the more similar the distributions. Also the basis of Wasserstein loss used in generative adversarial networks."
  },
  {
    term: "equality of opportunity",
    category: "metrics · responsible AI",
    definition: "A fairness metric satisfied when a model predicts the desirable outcome equally well for all values of a sensitive attribute — specifically, when the true positive rate is the same for all groups. Related to but less strict than equalized odds."
  },
  {
    term: "equalized odds",
    category: "metrics · responsible AI",
    definition: "A fairness metric satisfied when both the true positive rate and the false negative rate are the same for all groups defined by a sensitive attribute. Stricter than equality of opportunity, which focuses only on the positive class."
  },
  {
    term: "exact match",
    category: "metrics",
    definition: "An all-or-nothing metric where the model's output either matches ground truth exactly or it doesn't. For sequences (ranked lists), every item must be in the same order. If multiple correct sequences exist, matching any one satisfies exact match."
  },
  {
    term: "F1",
    category: "metrics",
    definition: "A binary classification metric combining precision and recall: F1 = 2 × (precision × recall) / (precision + recall). When precision and recall are similar, F1 is close to their mean. When they differ greatly, F1 is closer to the lower value."
  },
  {
    term: "fairness metric",
    category: "metrics · responsible AI",
    definition: "A mathematical definition of 'fairness' that is measurable. Common examples include equalized odds, predictive parity, counterfactual fairness, and demographic parity. Many fairness metrics are mutually exclusive — no single universal metric applies to all ML problems."
  },
  {
    term: "false negative rate",
    category: "metrics",
    definition: "The proportion of actual positive examples for which the model mistakenly predicted the negative class. Formula: FN / (FN + TP). Important for tasks where missing true positives is costly, such as disease detection."
  },
  {
    term: "hinge loss",
    category: "metrics",
    definition: "A family of loss functions for classification that find the decision boundary as distant as possible from each training example (maximizing margin). Used by kernel support vector machines (KSVMs). Formula: loss = max(0, 1 − (y × y'))."
  },
  {
    term: "incompatibility of fairness metrics",
    category: "metrics · responsible AI",
    definition: "The principle that some notions of fairness are mutually incompatible and cannot be satisfied simultaneously. Fairness must therefore be defined contextually for a given ML problem. This doesn't mean fairness efforts are fruitless — just that tradeoffs are unavoidable."
  },
  {
    term: "individual fairness",
    category: "metrics · responsible AI",
    definition: "A fairness metric that checks whether similar individuals are classified similarly. Relies entirely on how 'similarity' is defined — an inadequate similarity metric can introduce new fairness problems."
  },
  {
    term: "inter-rater agreement",
    category: "metrics",
    definition: "A measurement of how often human raters agree when performing a labeling task. Low agreement may indicate that task instructions need improvement. Also called inter-annotator agreement. Cohen's kappa is one of the most popular inter-rater agreement measurements."
  },
  {
    term: "LLM evaluations (evals)",
    category: "metrics",
    definition: "A set of metrics and benchmarks for assessing LLM performance. Used to identify improvement areas, compare different LLMs, identify the best model for a task, and ensure models are safe and ethical to use."
  },
  {
    term: "Mean Absolute Error (MAE)",
    category: "metrics",
    definition: "The average L1 loss per example. Calculated by summing the absolute differences between predicted and actual values, then dividing by the number of examples. Less sensitive to outliers than Mean Squared Error."
  },
  {
    term: "mean average precision at k (mAP@k)",
    category: "metrics",
    definition: "The statistical mean of all average precision at k scores across a validation dataset. Used to judge recommendation system quality across many users or prompts. Despite sounding redundant, 'mean average' is accurate — it finds the mean of multiple 'average precision' values."
  },
  {
    term: "Mean Squared Error (MSE)",
    category: "metrics",
    definition: "The average L2 loss per example. Calculated by summing the squared differences between predicted and actual values, then dividing by the number of examples. More sensitive to outliers than MAE because squaring amplifies large errors."
  },
  {
    term: "model capacity",
    category: "metrics",
    definition: "The complexity of problems that a model can learn. Typically increases with the number of model parameters. Higher capacity models can learn more complex patterns but are also more prone to overfitting."
  },
  {
    term: "pass at k (pass@k)",
    category: "metrics",
    definition: "A metric for code quality generated by an LLM. Tells you the likelihood that at least one of k generated code blocks will pass all unit tests. Higher k values produce higher scores but require more resources."
  },
  {
    term: "perplexity",
    category: "metrics",
    definition: "A measure of how well a model is accomplishing its task — roughly, the number of guesses needed to include the correct answer. Related to cross-entropy by: P = 2^(−cross-entropy). Lower perplexity = better model performance."
  },
  {
    term: "PR AUC (area under the PR curve)",
    category: "metrics",
    definition: "Area under the interpolated precision-recall curve, obtained by plotting (recall, precision) points for different classification threshold values. Useful for evaluating models on class-imbalanced datasets where ROC AUC can be misleading."
  },
  {
    term: "precision at k (precision@k)",
    category: "metrics",
    definition: "The fraction of the first k items in a ranked list that are relevant. Formula: relevant items in first k / k. The denominator is always k, not the total list length. Used to evaluate recommendation systems and LLM outputs."
  },
  {
    term: "precision-recall curve",
    category: "metrics",
    definition: "A curve of precision vs. recall at different classification thresholds. Useful when classes are imbalanced. A model with high precision and high recall at most thresholds is ideal. The area under this curve (PR AUC) summarizes overall performance."
  },
  {
    term: "prediction bias",
    category: "metrics",
    definition: "A value indicating how far apart the average of predictions is from the average of labels in the dataset. Not to be confused with the bias term in ML models or bias in ethics/fairness."
  },
  {
    term: "predictive parity",
    category: "metrics · responsible AI",
    definition: "A fairness metric that checks whether precision rates are equivalent across subgroups. For example, a college admission model satisfies predictive parity for nationality if its precision rate is the same for Lilliputians and Brobdingnagians."
  },
  {
    term: "recall at k (recall@k)",
    category: "metrics",
    definition: "The fraction of relevant items in the first k positions of a ranked list out of <em>all</em> relevant items returned. Formula: relevant items in first k / total relevant items in list. Contrast with precision@k, which uses k as the denominator."
  },
  {
    term: "ROUGE (Recall-Oriented Understudy for Gisting Evaluation)",
    category: "metrics",
    definition: "A family of recall-focused metrics that evaluate automatic summarization and machine translation by measuring N-gram overlap between reference text and generated text. ROUGE optimizes for recall (unlike BLEU, which optimizes for precision), making it better suited for summarization."
  },
  {
    term: "ROUGE-L",
    category: "metrics",
    definition: "A ROUGE variant focused on the length of the longest common subsequence between reference text and generated text. ROUGE-Lsum is preferred for multi-sentence passages — it finds the longest common subsequence per sentence and averages them."
  },
  {
    term: "ROUGE-N",
    category: "metrics",
    definition: "A set of ROUGE metrics that compare shared N-grams of a specific size between reference and generated text. ROUGE-1 measures shared tokens (unigrams); ROUGE-2 measures shared bigrams; ROUGE-3 measures shared trigrams."
  },
  {
    term: "R-squared",
    category: "metrics",
    definition: "A regression metric (0–1) indicating how much variation in a label is due to a feature or feature set. R² = 0 means none of the variation is explained; R² = 1 means all of it is. Equal to the square of the Pearson correlation coefficient."
  },
  {
    term: "sparsity",
    category: "metrics",
    definition: "The number of zero (or null) elements in a vector or matrix divided by the total number of entries. A 100-element matrix with 98 zeros has a sparsity of 0.98. Feature sparsity and model sparsity are two common contexts."
  },
  {
    term: "SuperGLUE",
    category: "metrics",
    definition: "An ensemble of datasets for rating an LLM's overall ability to understand and generate text — including BoolQ, CommitmentBank, COPA, MultiRC, ReCoRD, RTE, Words in Context, and Winograd Schema Challenge."
  },
  {
    term: "top-k accuracy",
    category: "metrics",
    definition: "The percentage of times a target label appears within the first k positions of a generated list. For example, if the target appears in the top 3 predictions 4 out of 5 times, top-3 accuracy = 80%. Also known as accuracy at k."
  },
  {
    term: "toxicity",
    category: "metrics",
    definition: "The degree to which content is abusive, threatening, or offensive. ML models can identify and classify toxicity along multiple parameters, such as level of abusive language and level of threatening language."
  },
  {
    term: "training loss",
    category: "metrics",
    definition: "A metric representing a model's loss during a particular training iteration. A downward slope on a loss curve means the model is improving; a flat slope signals convergence; an upward slope means the model is getting worse."
  },
  {
    term: "validation loss",
    category: "metrics",
    definition: "A metric representing a model's loss on the validation set during a particular training iteration. Tracking both training loss and validation loss (the generalization curve) helps detect overfitting — when validation loss climbs while training loss keeps falling."
  },
  {
    term: "variable importances",
    category: "metrics",
    definition: "A set of scores indicating the relative importance of each feature to a model. For example, in a house price decision tree, a variable importance of {size=5.8, age=2.5, style=4.7} means size is more important than age or style."
  }
];

export default METRICS;
