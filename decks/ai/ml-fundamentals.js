// ─────────────────────────────────────────────
// ML Fundamentals Cards
// Source: developers.google.com/machine-learning/glossary/fundamentals
// ─────────────────────────────────────────────
const ML_FUNDAMENTALS = [
  {
    term: "accuracy",
    category: "fundamentals · metrics",
    definition: "The fraction of correct predictions out of total predictions. Calculated as: (correct predictions) / (correct + incorrect predictions). For binary classification: (TP + TN) / (TP + TN + FP + FN). Can be misleading on class-imbalanced datasets."
  },
  {
    term: "activation function",
    category: "fundamentals · neural networks",
    definition: "A function that enables neural networks to learn nonlinear (complex) relationships between features and labels. Common examples include <strong>ReLU</strong> and <strong>sigmoid</strong>. Activation function plots are never single straight lines."
  },
  {
    term: "artificial intelligence",
    category: "fundamentals",
    definition: "A non-human program or model that can solve sophisticated tasks — such as translating text or identifying diseases from images. Machine learning is formally a sub-field of AI, though the terms are often used interchangeably today."
  },
  {
    term: "AUC (Area under the ROC curve)",
    category: "fundamentals · metrics",
    definition: "A number between 0.0 and 1.0 representing a binary classification model's ability to separate positive from negative classes. Closer to 1.0 = better. AUC considers all possible classification thresholds and equals the probability the model ranks a random positive higher than a random negative."
  },
  {
    term: "backpropagation",
    category: "fundamentals · neural networks",
    definition: "The algorithm that implements gradient descent in neural networks. Training cycles through a <strong>forward pass</strong> (compute predictions and loss) and a <strong>backward pass</strong> (adjust neuron weights to reduce loss). Implements the chain rule from calculus."
  },
  {
    term: "batch",
    category: "fundamentals · training",
    definition: "The set of examples used in one training iteration. The batch size determines how many examples are in each batch. Related to but distinct from an epoch."
  },
  {
    term: "batch size",
    category: "fundamentals · training",
    definition: "The number of examples processed per training iteration. Key strategies: <strong>SGD</strong> (batch size 1), <strong>full batch</strong> (entire training set, usually inefficient), and <strong>mini-batch</strong> (10–1000 examples, usually most efficient)."
  },
  {
    term: "bias (ethics/fairness)",
    category: "fundamentals · responsible AI",
    definition: "Stereotyping, prejudice, or favoritism toward some things, people, or groups. Also refers to systematic error introduced by sampling or reporting procedures (coverage bias, selection bias, reporting bias, etc.). Distinct from the math term 'bias.'"
  },
  {
    term: "bias (math)",
    category: "fundamentals",
    definition: "An intercept or offset from the origin in a model. Symbolized as <strong>b</strong> or <strong>w₀</strong>. In the formula y' = b + w₁x₁ + …, bias is the y-intercept. It exists because not all models start from the origin."
  },
  {
    term: "binary classification",
    category: "fundamentals",
    definition: "A classification task that predicts one of exactly two mutually exclusive classes: a <strong>positive class</strong> and a <strong>negative class</strong>. Examples: spam vs. not spam; disease vs. no disease."
  },
  {
    term: "bucketing",
    category: "fundamentals · feature engineering",
    definition: "Converting a single continuous feature into multiple binary features (buckets/bins) based on value ranges. For example, temperature could become 'cold' (≤10°C), 'temperate' (11–24°C), and 'warm' (≥25°C) buckets. The model treats all values in the same bucket identically."
  },
  {
    term: "categorical data",
    category: "fundamentals",
    definition: "Features with a specific, finite set of possible values. For example, a traffic-light-state feature can only be 'red', 'yellow', or 'green'. Also called <strong>discrete features</strong>. Contrast with numerical (continuous) data."
  },
  {
    term: "class",
    category: "fundamentals",
    definition: "A category that a label can belong to. In a spam classifier, classes are 'spam' and 'not spam'. In a dog breed classifier, classes might be 'poodle', 'beagle', 'pug', etc. Classification models predict classes; regression models predict numbers."
  },
  {
    term: "classification model",
    category: "fundamentals",
    definition: "A model whose prediction is a class. Examples: a model predicting a sentence's language, a model predicting tree species, or a model predicting a medical condition. Two common types: binary classification and multi-class classification."
  },
  {
    term: "classification threshold",
    category: "fundamentals",
    definition: "A number between 0 and 1 that converts a logistic regression model's raw output into a positive or negative class prediction. If raw value > threshold → positive class; if < threshold → negative class. Chosen by humans, not learned during training."
  },
  {
    term: "classifier",
    category: "fundamentals",
    definition: "An informal term for a classification model."
  },
  {
    term: "class-imbalanced dataset",
    category: "fundamentals",
    definition: "A dataset where the total number of labels for each class differs significantly. For example: 1,000,000 negative labels but only 10 positive labels. Class imbalance presents special training challenges — accuracy alone becomes a misleading metric."
  },
  {
    term: "clipping",
    category: "fundamentals",
    definition: "A technique for handling outliers by capping feature values at a maximum threshold and/or raising them to a minimum threshold. Prevents outliers from damaging model weights or spoiling metrics during training."
  },
  {
    term: "confusion matrix",
    category: "fundamentals · metrics",
    definition: "An N×N table summarizing correct and incorrect predictions from a classification model. Rows represent ground truth; columns represent predictions. Contains enough information to calculate precision, recall, accuracy, and other metrics."
  },
  {
    term: "continuous feature",
    category: "fundamentals",
    definition: "A floating-point feature with an infinite range of possible values, such as temperature or weight. Contrast with discrete (categorical) features."
  },
  {
    term: "convergence",
    category: "fundamentals · training",
    definition: "A state where loss values change very little or not at all with each training iteration. A model converges when additional training won't meaningfully improve it. In deep learning, loss can plateau for many iterations before converging — a false sense of convergence."
  },
  {
    term: "DataFrame",
    category: "fundamentals · tools",
    definition: "A popular pandas data type for representing datasets in memory. Analogous to a table or spreadsheet — each column has a name and each row has a unique index. Each column can have its own data type."
  },
  {
    term: "dataset",
    category: "fundamentals",
    definition: "A collection of raw data, commonly organized as a spreadsheet or a CSV (comma-separated values) file."
  },
  {
    term: "deep model",
    category: "fundamentals · neural networks",
    definition: "A neural network containing more than one hidden layer. Also called a <strong>deep neural network (DNN)</strong>. Contrast with wide models."
  },
  {
    term: "dense feature",
    category: "fundamentals",
    definition: "A feature where most or all values are nonzero, typically a tensor of floating-point values. Contrast with a sparse feature, where most values are zero."
  },
  {
    term: "depth",
    category: "fundamentals · neural networks",
    definition: "The sum of hidden layers + output layers + embedding layers in a neural network. A network with five hidden layers and one output layer has a depth of 6. The input layer does not influence depth."
  },
  {
    term: "discrete feature",
    category: "fundamentals",
    definition: "A feature with a finite set of possible values — for example, one that can only be 'animal', 'vegetable', or 'mineral'. Also called a categorical feature. Contrast with continuous features."
  },
  {
    term: "dynamic model",
    category: "fundamentals",
    definition: "A model that is frequently (maybe even continuously) retrained. A 'lifelong learner' that constantly adapts to evolving data. Also called an <strong>online model</strong>. Contrast with static models."
  },
  {
    term: "early stopping",
    category: "fundamentals · regularization",
    definition: "A regularization method that ends training before training loss finishes decreasing — specifically when validation loss starts to increase (generalization is worsening). Prevents overfitting by stopping before the model memorizes the training set."
  },
  {
    term: "embedding layer",
    category: "fundamentals · neural networks",
    definition: "A special hidden layer that trains on a high-dimensional categorical feature to gradually learn a lower-dimension embedding vector. Enables far more efficient training than using raw one-hot encoding on features with many possible values (e.g., 73,000 tree species)."
  },
  {
    term: "epoch",
    category: "fundamentals · training",
    definition: "A full training pass over the entire training set, where each example has been processed once. One epoch = N / batch_size training iterations. If the dataset has 1,000 examples and batch size is 50, one epoch = 20 iterations."
  },
  {
    term: "example",
    category: "fundamentals",
    definition: "The values of one row of features, possibly with a label. A <strong>labeled example</strong> (features + label) is used during training. An <strong>unlabeled example</strong> (features only) is used during inference."
  },
  {
    term: "false negative (FN)",
    category: "fundamentals · metrics",
    definition: "An example where the model mistakenly predicts the negative class, but the true label is positive. For example: predicting an email is 'not spam' when it actually is spam."
  },
  {
    term: "false positive (FP)",
    category: "fundamentals · metrics",
    definition: "An example where the model mistakenly predicts the positive class, but the true label is negative. For example: predicting an email is 'spam' when it actually is not spam."
  },
  {
    term: "false positive rate (FPR)",
    category: "fundamentals · metrics",
    definition: "The proportion of actual negatives that the model mistakenly predicted as positive. Formula: FP / (FP + TN). The FPR is the x-axis of an ROC curve."
  },
  {
    term: "feature",
    category: "fundamentals",
    definition: "An input variable to a machine learning model. An example consists of one or more features. For example, a model predicting test scores might use temperature, humidity, and pressure as features. Contrast with label."
  },
  {
    term: "feature cross",
    category: "fundamentals · feature engineering",
    definition: "A synthetic feature formed by 'crossing' (taking the Cartesian product of) categorical or bucketed features. Allows a linear model to learn relationships between combinations — e.g., 'freezing-windy' behaves differently from 'freezing-still'. Mostly used in linear models, rarely in neural networks."
  },
  {
    term: "feature engineering",
    category: "fundamentals · feature engineering",
    definition: "The process of (1) determining which features might be useful for a model, and (2) converting raw data into efficient feature representations. Also called feature extraction or featurization. Includes techniques like bucketing and feature crosses."
  },
  {
    term: "feature set",
    category: "fundamentals",
    definition: "The group of features a machine learning model trains on. For example, a housing price model might use postal code, property size, and condition as its feature set."
  },
  {
    term: "feature vector",
    category: "fundamentals",
    definition: "The array of feature values comprising an example, used as input during training and inference. Feature engineering determines how each feature is represented in the vector (e.g., one-hot encoding for categorical features)."
  },
  {
    term: "feedback loop",
    category: "fundamentals",
    definition: "A situation where a model's predictions influence the training data for the same or another model. Example: a movie recommendation model influences which films people watch, which then influences the next version of the model."
  },
  {
    term: "generalization",
    category: "fundamentals",
    definition: "A model's ability to make correct predictions on new, previously unseen data. The opposite of overfitting. Regularization encourages generalization by reducing how precisely the model fits the quirks of the training data."
  },
  {
    term: "generalization curve",
    category: "fundamentals",
    definition: "A plot of both training loss and validation loss as a function of training iterations. Helps detect overfitting: if validation loss eventually climbs significantly above training loss, the model is likely overfitting."
  },
  {
    term: "gradient descent",
    category: "fundamentals · training",
    definition: "A mathematical technique to minimize loss by iteratively adjusting weights and biases, gradually finding the combination that produces the lowest loss. One of the foundational algorithms in machine learning."
  },
  {
    term: "ground truth",
    category: "fundamentals",
    definition: "Reality — what actually happened. The thing a model is trying to predict. Model quality is assessed against ground truth. Note: ground truth is not always perfectly reliable — data collection errors and human rater inconsistency can introduce imperfections."
  },
  {
    term: "hidden layer",
    category: "fundamentals · neural networks",
    definition: "A layer in a neural network between the input layer (features) and the output layer (predictions). Each hidden layer consists of one or more neurons. A deep neural network has more than one hidden layer."
  },
  {
    term: "hyperparameter",
    category: "fundamentals · training",
    definition: "Variables that you (or a tuning service) set before and between training runs — such as learning rate or batch size. Contrast with <strong>parameters</strong> (weights and biases), which the model learns automatically during training."
  },
  {
    term: "i.i.d. (independently and identically distributed)",
    category: "fundamentals",
    definition: "Data drawn from a distribution that doesn't change, where each value is independent of previous values. Described as the 'ideal gas' of machine learning — a useful mathematical construct but almost never exactly found in real-world data."
  },
  {
    term: "inference",
    category: "fundamentals",
    definition: "In traditional ML: making predictions by applying a trained model to unlabeled examples. In large language models: using a trained model to generate a response to a prompt."
  },
  {
    term: "input layer",
    category: "fundamentals · neural networks",
    definition: "The layer of a neural network that holds the feature vector. It provides examples for training or inference. The input layer does not count toward a network's depth."
  },
  {
    term: "interpretability",
    category: "fundamentals",
    definition: "The ability to explain or present a model's reasoning in understandable human terms. Linear regression models and decision forests are highly interpretable. Deep neural networks typically require sophisticated visualization to interpret."
  },
  {
    term: "iteration",
    category: "fundamentals · training",
    definition: "A single update of a model's parameters (weights and biases) during training. One iteration processes one batch of examples: forward pass to compute loss, then backward pass (backpropagation) to update parameters."
  },
  {
    term: "L1 loss",
    category: "fundamentals · metrics",
    definition: "A loss function that calculates the <strong>absolute value</strong> of the difference between actual and predicted label values. Less sensitive to outliers than L2 loss. The Mean Absolute Error (MAE) is the average L1 loss per example."
  },
  {
    term: "L1 regularization",
    category: "fundamentals · regularization",
    definition: "Regularization that penalizes weights in proportion to the sum of their absolute values. Drives irrelevant or barely relevant feature weights to exactly 0, effectively removing those features from the model."
  },
  {
    term: "L2 loss",
    category: "fundamentals · metrics",
    definition: "A loss function that calculates the <strong>square</strong> of the difference between actual and predicted label values. More sensitive to outliers than L1 loss because squaring amplifies large errors. Also called squared loss. Mean Squared Error (MSE) is average L2 loss per example."
  },
  {
    term: "L2 regularization",
    category: "fundamentals · regularization",
    definition: "Regularization that penalizes weights in proportion to the sum of their squares. Drives outlier weights close to — but not exactly — 0. Always improves generalization in linear models. Also called ridge regularization."
  },
  {
    term: "label",
    category: "fundamentals",
    definition: "In supervised machine learning, the 'answer' or 'result' portion of an example. For example, in a spam detection dataset the label is 'spam' or 'not spam'. In a rainfall dataset it might be the amount of rain that fell."
  },
  {
    term: "labeled example",
    category: "fundamentals",
    definition: "An example that contains one or more features <em>and</em> a label. Used during training. Contrast with unlabeled examples, which have features but no label and are used during inference."
  },
  {
    term: "lambda (regularization rate)",
    category: "fundamentals · regularization",
    definition: "Synonym for <strong>regularization rate</strong>. The Greek letter λ scales how much regularization affects the loss function: minimize(loss + λ × regularization). Higher λ = more regularization = less overfitting, but potentially less predictive power."
  },
  {
    term: "layer",
    category: "fundamentals · neural networks",
    definition: "A set of neurons in a neural network. Three common types: <strong>input layer</strong> (holds feature values), <strong>hidden layer(s)</strong> (find nonlinear relationships), and <strong>output layer</strong> (produces the prediction)."
  },
  {
    term: "learning rate",
    category: "fundamentals · training",
    definition: "A hyperparameter that controls how strongly gradient descent adjusts weights and biases on each iteration. Too low → training takes too long. Too high → gradient descent struggles to converge. The learning rate multiplies the gradient to produce the gradient step."
  },
  {
    term: "linear model",
    category: "fundamentals",
    definition: "A model that assigns one weight per feature to make predictions (plus a bias term). Formula: y' = b + w₁x₁ + w₂x₂ + … Usually easier to train and more interpretable than deep models. Linear regression and logistic regression are both linear models."
  },
  {
    term: "linear regression",
    category: "fundamentals",
    definition: "A type of ML model that is both a <strong>linear model</strong> and a <strong>regression model</strong> — meaning it uses a linear equation to produce a floating-point numerical prediction."
  },
  {
    term: "logistic regression",
    category: "fundamentals",
    definition: "A regression model that predicts a <strong>probability</strong> for a categorical label. Uses a linear architecture + sigmoid function to output a value between 0 and 1. Despite the name, it's typically used as a binary classification model via a classification threshold."
  },
  {
    term: "Log Loss",
    category: "fundamentals · metrics",
    definition: "The loss function used in binary logistic regression. It penalizes confident wrong predictions far more than uncertain ones. Formula: Σ[−y·log(y') − (1−y)·log(1−y')] where y is the true label (0 or 1) and y' is the predicted probability."
  },
  {
    term: "log-odds",
    category: "fundamentals",
    definition: "The logarithm of the odds of an event. For a probability p, odds = p / (1−p), and log-odds = ln(p / (1−p)). The log-odds function is the inverse of the sigmoid function."
  },
  {
    term: "loss",
    category: "fundamentals · metrics",
    definition: "During supervised model training, a measure of how far a model's prediction is from the ground truth label. A loss function calculates this value. The goal of training is to minimize loss."
  },
  {
    term: "loss curve",
    category: "fundamentals",
    definition: "A plot of loss as a function of training iterations. Helps determine when a model is converging or overfitting. Can show training loss, validation loss, and test loss."
  },
  {
    term: "loss function",
    category: "fundamentals · metrics",
    definition: "A mathematical function that calculates loss on a batch of examples. Returns lower loss for better predictions. Choose the right loss function for your model type: <strong>L2 loss / MSE</strong> for linear regression, <strong>Log Loss</strong> for logistic regression."
  },
  {
    term: "machine learning",
    category: "fundamentals",
    definition: "A program or system that trains a model from input data so the model can make useful predictions on new data drawn from the same distribution. Also the field of study concerned with such systems."
  },
  {
    term: "majority class",
    category: "fundamentals",
    definition: "The more common label in a class-imbalanced dataset. For example, in a dataset with 99% negative labels and 1% positive, the negative labels are the majority class."
  },
  {
    term: "mini-batch",
    category: "fundamentals · training",
    definition: "A small, randomly selected subset of examples processed in one training iteration. Batch size is usually between 10 and 1,000. Far more efficient than computing loss over the entire training set (full batch) each iteration."
  },
  {
    term: "minority class",
    category: "fundamentals",
    definition: "The less common label in a class-imbalanced dataset. The count of minority class examples often matters more than the total dataset size — a large dataset with few minority examples may still train poorly."
  },
  {
    term: "model",
    category: "fundamentals",
    definition: "Any mathematical construct that processes input data and returns output — the set of parameters and structure needed to make predictions. In supervised ML, a model takes an example as input and infers a prediction as output."
  },
  {
    term: "multi-class classification",
    category: "fundamentals",
    definition: "A classification problem where the dataset contains <em>more than two</em> classes of labels. For example, classifying iris type as setosa, virginica, or versicolor. Contrast with binary classification (exactly two classes)."
  },
  {
    term: "negative class",
    category: "fundamentals · metrics",
    definition: "In binary classification, one of two classes — the 'other' possibility that isn't being specifically tested for. For example: 'not tumor' or 'not spam'. Contrast with the positive class."
  },
  {
    term: "neural network",
    category: "fundamentals · neural networks",
    definition: "A model containing at least one hidden layer. Each neuron connects to all nodes in the next layer. Neural networks can model extremely complex nonlinear relationships between features and labels. A deep neural network has more than one hidden layer."
  },
  {
    term: "neuron",
    category: "fundamentals · neural networks",
    definition: "A distinct unit within a hidden layer. Each neuron: (1) calculates the weighted sum of its inputs, then (2) passes that sum through an activation function. Neurons in the first hidden layer take feature values as input; deeper neurons take prior layer outputs."
  },
  {
    term: "node (neural network)",
    category: "fundamentals · neural networks",
    definition: "A synonym for neuron in a hidden layer."
  },
  {
    term: "nonlinear",
    category: "fundamentals",
    definition: "A relationship between variables that can't be represented solely through addition and multiplication — i.e., can't be plotted as a straight line. Neural networks are powerful because they can learn nonlinear relationships between features and labels."
  },
  {
    term: "nonstationarity",
    category: "fundamentals",
    definition: "A feature whose values change across one or more dimensions, usually time. For example: swimsuit sales varying by season, or shifting annual temperatures due to climate change. Contrast with stationarity."
  },
  {
    term: "normalization",
    category: "fundamentals · feature engineering",
    definition: "Converting a variable's actual range of values into a standard range such as −1 to +1, 0 to 1, or Z-scores. Models usually train faster and produce better predictions when all numerical features have roughly the same range."
  },
  {
    term: "numerical data",
    category: "fundamentals",
    definition: "Features represented as integers or real-valued numbers that have a mathematical relationship to the label (e.g., square footage of a house). Not all integers are numerical — postal codes should be categorical, not numerical."
  },
  {
    term: "offline inference",
    category: "fundamentals",
    definition: "Generating a batch of predictions in advance and caching them so apps can retrieve results without re-running the model. Also called <strong>static inference</strong>. Contrast with online inference (predictions on demand)."
  },
  {
    term: "one-hot encoding",
    category: "fundamentals · feature engineering",
    definition: "Representing a categorical feature as a vector where exactly one element is 1 and all others are 0. For example, 'Norway' out of 5 Scandinavian countries → [0, 0, 1, 0, 0]. Prevents the model from inferring false mathematical relationships between categories."
  },
  {
    term: "one-vs.-all",
    category: "fundamentals",
    definition: "A strategy for N-class classification using N separate binary classifiers — one per class. Each binary classifier answers 'is this example class X or not?' For example, a 3-class problem becomes 3 binary classifiers."
  },
  {
    term: "online inference",
    category: "fundamentals",
    definition: "Generating predictions on demand in response to a request. Contrast with offline (static) inference, where predictions are pre-computed and cached."
  },
  {
    term: "output layer",
    category: "fundamentals · neural networks",
    definition: "The final layer of a neural network that contains the prediction. Every neural network has exactly one output layer."
  },
  {
    term: "overfitting",
    category: "fundamentals",
    definition: "When a model matches the training data so closely that it fails to make correct predictions on new data. Caused by training too long or on too little data. Regularization and diverse training sets help reduce overfitting."
  },
  {
    term: "pandas",
    category: "fundamentals · tools",
    definition: "A column-oriented data analysis API built on numpy. Many ML frameworks including TensorFlow support pandas data structures as inputs. Its primary data type is the <strong>DataFrame</strong>."
  },
  {
    term: "parameter",
    category: "fundamentals · training",
    definition: "The weights and biases that a model <em>learns</em> during training. Contrast with hyperparameters, which are set by the engineer before training. In linear regression: y' = b + w₁x₁ + …, all the w's and b are parameters."
  },
  {
    term: "positive class",
    category: "fundamentals · metrics",
    definition: "In binary classification, the class being specifically tested for — e.g., 'tumor' in a cancer model or 'spam' in an email classifier. Note: a 'positive' result is often an undesirable outcome (disease, fraud, etc.)."
  },
  {
    term: "post-processing",
    category: "fundamentals · responsible AI",
    definition: "Adjusting the output of a model <em>after</em> it runs, without modifying the model itself. Can be used to enforce fairness constraints — for example, adjusting a classification threshold to equalize true positive rates across demographic groups."
  },
  {
    term: "precision",
    category: "fundamentals · metrics",
    definition: "Of all the times the model predicted the positive class, what fraction was actually positive? Formula: TP / (TP + FP). High precision means few false alarms. Contrast with recall."
  },
  {
    term: "prediction",
    category: "fundamentals",
    definition: "A model's output. For classification models: a class. For regression models: a number. For example, a spam classifier predicts 'spam' or 'not spam'; a house price model predicts a dollar value."
  },
  {
    term: "proxy labels",
    category: "fundamentals",
    definition: "Data used to approximate labels that aren't directly available in a dataset. For example, using 'workplace accidents' as a proxy for 'employee stress level.' Proxy labels are often imperfect — choose them carefully."
  },
  {
    term: "RAG (retrieval-augmented generation)",
    category: "fundamentals",
    definition: "A technique for improving LLM output quality by grounding it with knowledge retrieved after training. The system retrieves relevant documents, appends them to the user query, and instructs the LLM to answer based on that context. Improves factual accuracy and currency."
  },
  {
    term: "rater",
    category: "fundamentals",
    definition: "A human who provides labels for examples. Also called an annotator. Rater consistency is important — when labels involve human judgment, expert raters are sometimes used to improve agreement."
  },
  {
    term: "recall",
    category: "fundamentals · metrics",
    definition: "Of all the actual positive examples, what fraction did the model correctly identify? Formula: TP / (TP + FN). High recall means few missed positives. Especially important when the positive class is rare. Contrast with precision."
  },
  {
    term: "ReLU (Rectified Linear Unit)",
    category: "fundamentals · neural networks",
    definition: "An activation function: output = 0 if input ≤ 0, output = input if input > 0. Simple yet powerful — enables neural networks to learn nonlinear relationships. One of the most popular activation functions in deep learning."
  },
  {
    term: "regression model",
    category: "fundamentals",
    definition: "A model that generates a <strong>numerical prediction</strong> (contrast with classification models, which predict a class). Examples: predicting house price in euros, tree life expectancy in years, or rain in inches."
  },
  {
    term: "regularization",
    category: "fundamentals · regularization",
    definition: "Any mechanism that reduces overfitting. Types include L1, L2, dropout, and early stopping. Counterintuitively, regularization often <em>increases</em> training loss while improving real-world prediction quality — because the goal is generalization, not minimizing training loss."
  },
  {
    term: "regularization rate (lambda)",
    category: "fundamentals · regularization",
    definition: "A number specifying the relative importance of regularization during training. Higher rate → less overfitting but potentially less predictive power. Represented as λ in the loss equation: minimize(loss + λ × regularization)."
  },
  {
    term: "ROC curve",
    category: "fundamentals · metrics",
    definition: "A graph of true positive rate (y-axis) vs. false positive rate (x-axis) at every possible classification threshold. A perfect model hugs the top-left corner. A random model is a diagonal line. The area under the ROC curve is <strong>AUC</strong>."
  },
  {
    term: "Root Mean Squared Error (RMSE)",
    category: "fundamentals · metrics",
    definition: "The square root of the Mean Squared Error (MSE). Expresses average prediction error in the same units as the label, making it easier to interpret than MSE."
  },
  {
    term: "sigmoid function",
    category: "fundamentals · neural networks",
    definition: "A mathematical function that 'squishes' any input value into the range (0, 1). Used to: convert logistic regression raw output to a probability, and as an activation function in neural networks. Its inverse is the log-odds function."
  },
  {
    term: "softmax",
    category: "fundamentals · neural networks",
    definition: "A function that converts a vector of raw prediction scores into a probability distribution summing to 1.0, used in multi-class classification. The class with the highest probability becomes the prediction. Sometimes called full softmax."
  },
  {
    term: "sparse feature",
    category: "fundamentals",
    definition: "A feature in which most values are zero or empty, typically a tensor of mostly zeros. Common in categorical data with many possible values. Contrast with a dense feature (most values nonzero)."
  },
  {
    term: "static model",
    category: "fundamentals",
    definition: "A model trained once and then deployed without further retraining. Contrast with a dynamic (online) model, which is retrained frequently. Static models can become stale as the world changes."
  },
  {
    term: "stationarity",
    category: "fundamentals",
    definition: "A feature whose values remain consistent over time and across contexts. Contrast with nonstationarity, where values shift (e.g., seasonal patterns, trends). Models trained on stationary data may generalize better over time."
  },
  {
    term: "stochastic gradient descent (SGD)",
    category: "fundamentals · training",
    definition: "A gradient descent algorithm where the batch size is 1 — parameters are updated after each single example. Very noisy but fast. In practice, mini-batch gradient descent (batch size 10–1,000) is usually preferred."
  },
  {
    term: "supervised machine learning",
    category: "fundamentals",
    definition: "Training a model on labeled examples (features + labels), where the model learns to predict the label from the features. Contrast with unsupervised machine learning, which trains on unlabeled data to discover structure."
  },
  {
    term: "synthetic feature",
    category: "fundamentals · feature engineering",
    definition: "A feature not present in the raw input data, but derived from one or more existing features. For example, a feature cross combining 'temperature bucket' and 'wind speed bucket'. Synthetic features can reveal patterns raw features can't."
  },
  {
    term: "test set",
    category: "fundamentals",
    definition: "The subset of the dataset used to evaluate a fully trained model's performance. The test set is used only once — after training and validation are complete. Contrast with training set and validation set."
  },
  {
    term: "training",
    category: "fundamentals",
    definition: "The process of determining the ideal parameters (weights and biases) for a model by running gradient descent on labeled examples. A trained model can then make predictions on new, unlabeled data."
  },
  {
    term: "training set",
    category: "fundamentals",
    definition: "The subset of the dataset used to train a model. Contrast with validation set (used to tune hyperparameters) and test set (used for final evaluation). Models should not be evaluated on their training set."
  },
  {
    term: "true negative (TN)",
    category: "fundamentals · metrics",
    definition: "An example where the model correctly predicted the negative class. For example: correctly predicting an email is 'not spam' when it actually isn't spam."
  },
  {
    term: "true positive (TP)",
    category: "fundamentals · metrics",
    definition: "An example where the model correctly predicted the positive class. For example: correctly predicting an email is 'spam' when it actually is spam."
  },
  {
    term: "true positive rate (TPR)",
    category: "fundamentals · metrics",
    definition: "Synonym for <strong>recall</strong>. The proportion of actual positives that the model correctly identified. Formula: TP / (TP + FN). The y-axis of the ROC curve."
  },
  {
    term: "underfitting",
    category: "fundamentals",
    definition: "When a model is too simple to capture the underlying pattern in the data — producing poor predictions on both training and new data. The opposite of overfitting. Caused by insufficient model complexity or too little training."
  },
  {
    term: "unlabeled example",
    category: "fundamentals",
    definition: "An example that contains features but no label. Used during inference (prediction). Contrast with labeled examples, which have both features and a label and are used during training."
  },
  {
    term: "unsupervised machine learning",
    category: "fundamentals",
    definition: "Training a model on unlabeled data to discover hidden structure or patterns — such as clusters, embeddings, or anomalies. Contrast with supervised machine learning, which trains on labeled examples."
  },
  {
    term: "validation set",
    category: "fundamentals",
    definition: "The subset of the dataset used to evaluate a model during training — to tune hyperparameters and detect overfitting — without touching the test set. Using a separate validation set prevents overfitting to the test set."
  },
  {
    term: "weight",
    category: "fundamentals",
    definition: "A value that a model multiplies by a feature value to compute a prediction. In a linear model: y' = b + w₁x₁ + w₂x₂ + …, each w is a weight. Weights are learned during training via gradient descent."
  },
  {
    term: "Z-score normalization",
    category: "fundamentals · feature engineering",
    definition: "A normalization technique that replaces each feature value x with (x − μ) / σ, where μ is the feature mean and σ is its standard deviation. Results in a distribution with mean 0 and standard deviation 1. A form of scaling that handles outliers reasonably well."
  }
];

export default ML_FUNDAMENTALS;
