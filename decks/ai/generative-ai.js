// ─────────────────────────────────────────────
// Generative AI Cards
// Source: developers.google.com/machine-learning/glossary/generative
// ─────────────────────────────────────────────
const GENERATIVE_AI = [
  {
    term: "agent",
    category: "generative AI",
    definition: "Software that can reason about multimodal user inputs in order to plan and execute actions on behalf of the user. In reinforcement learning, an agent uses a policy to maximize expected return gained from transitioning between states of the environment."
  },
  {
    term: "agentic workflow",
    category: "generative AI",
    definition: "A dynamic process in which an agent autonomously plans and executes actions to achieve a goal. The process may involve reasoning, invoking external tools, and self-correcting its plan."
  },
  {
    term: "auto-regressive model",
    category: "generative AI",
    definition: "A model that infers a prediction based on its own previous predictions. For example, auto-regressive language models predict the next token based on previously predicted tokens. All Transformer-based large language models are auto-regressive."
  },
  {
    term: "base model",
    category: "generative AI",
    definition: "A pre-trained model that can serve as the starting point for fine-tuning to address specific tasks or applications. Also called a foundation model when it is very large and trained on an enormous, diverse dataset."
  },
  {
    term: "chain-of-thought prompting",
    category: "generative AI",
    definition: "A prompt engineering technique that encourages an LLM to explain its reasoning step by step. Forces the model to perform all relevant calculations and enables the user to examine the steps to verify the answer makes sense."
  },
  {
    term: "context window",
    category: "generative AI",
    definition: "The number of tokens a model can process in a given prompt. The larger the context window, the more information the model can use to provide coherent and consistent responses."
  },
  {
    term: "contextualized language embedding",
    category: "generative AI",
    definition: "An embedding that approaches 'understanding' words and phrases the way fluent human speakers can — capturing complex syntax, semantics, and context. Can recognize, for example, that 'cow' is sometimes used casually to mean either cow or bull."
  },
  {
    term: "distillation",
    category: "generative AI",
    definition: "Reducing the size of a large model (the 'teacher') into a smaller model (the 'student') that emulates the original's predictions as faithfully as possible. The student has faster inference and lower memory/energy usage, but typically somewhat lower quality predictions."
  },
  {
    term: "factuality",
    category: "generative AI",
    definition: "A property describing a model whose output is based on reality. A factual model would correctly answer 'NaCl' for 'What is the chemical formula for table salt?' Note: some prompts (e.g., 'write a limerick') should optimize creativity over factuality."
  },
  {
    term: "few-shot prompting",
    category: "generative AI",
    definition: "A prompt that contains more than one example demonstrating how the LLM should respond. Generally produces more desirable results than zero-shot or one-shot prompting, but requires a longer prompt. A form of prompt-based learning."
  },
  {
    term: "fine-tuning",
    category: "generative AI",
    definition: "A second, task-specific training pass on a pre-trained model to refine its parameters for a specific use case. Typically involves hundreds or thousands of task-specific examples. Can modify all parameters (full fine-tuning) or only some (parameter-efficient tuning)."
  },
  {
    term: "foundation model",
    category: "generative AI",
    definition: "A very large pre-trained model trained on an enormous and diverse dataset. Can respond well to a wide range of requests and serve as a base model for fine-tuning or other customization."
  },
  {
    term: "generative AI",
    category: "generative AI",
    definition: "An emerging field where models create original, complex, and coherent content. Examples include LLMs (text), image generation models, audio/music generation models, and video generation models."
  },
  {
    term: "GPT (Generative Pre-trained Transformer)",
    category: "generative AI",
    definition: "A family of Transformer-based large language models developed by OpenAI. GPT variants apply to multiple modalities including image generation (ImageGPT) and text-to-image generation (DALL-E)."
  },
  {
    term: "hallucination",
    category: "generative AI",
    definition: "The production of plausible-seeming but factually incorrect output by a generative AI model that purports to be making an assertion about the real world. For example, a model claiming that Barack Obama died in 1865 is hallucinating."
  },
  {
    term: "human in the loop (HITL)",
    category: "generative AI",
    definition: "A strategy or system for ensuring that people help shape, evaluate, and refine a model's behavior — enabling AI to benefit from both machine and human intelligence. For example, a system where AI generates code that engineers then review."
  },
  {
    term: "instruction tuning",
    category: "generative AI",
    definition: "A form of fine-tuning that improves a generative AI model's ability to follow instructions. Involves training on a series of instruction prompts covering a wide variety of tasks, resulting in improved responses to zero-shot prompts."
  },
  {
    term: "large language model (LLM)",
    category: "generative AI",
    definition: "At minimum, a language model with a very high number of parameters. More informally, any Transformer-based language model such as Gemini or GPT. LLMs are auto-regressive and capable of generating coherent, sophisticated text."
  },
  {
    term: "latency",
    category: "generative AI",
    definition: "The time it takes for a model to process input and generate a response. Influenced by input/output token lengths, model complexity, and infrastructure. Optimizing for latency is crucial for responsive, user-friendly applications."
  },
  {
    term: "LoRA (Low-Rank Adaptability)",
    category: "generative AI",
    definition: "A parameter-efficient fine-tuning technique that 'freezes' pre-trained weights and inserts a small set of trainable weights (update matrixes). Much faster to train than full fine-tuning. Reduces inference cost by enabling concurrent serving of multiple specialized models sharing the same base."
  },
  {
    term: "mixture of experts (MoE)",
    category: "generative AI",
    definition: "A scheme to increase neural network efficiency by using only a subset of its parameters (an 'expert') to process a given input token. A gating network routes each token to the appropriate expert(s), reducing computation per token."
  },
  {
    term: "model cascading",
    category: "generative AI",
    definition: "A system that picks the ideal model for a specific inference query — selecting smaller models for simple requests and larger models for complex ones. The main motivation is to reduce inference costs while maintaining quality."
  },
  {
    term: "one-shot prompting",
    category: "generative AI",
    definition: "A prompt that contains exactly one example demonstrating how the LLM should respond. Produces better results than zero-shot prompting, but fewer examples than few-shot prompting. Compare: zero-shot (no examples), few-shot (multiple examples)."
  },
  {
    term: "parameter-efficient tuning",
    category: "generative AI",
    definition: "Techniques to fine-tune a large pre-trained language model more efficiently than full fine-tuning by modifying far fewer parameters. Generally produces a model that performs as well (or nearly as well) as a fully fine-tuned model."
  },
  {
    term: "pre-trained model",
    category: "generative AI",
    definition: "A trained large language model or other generative AI model. Pre-trained models are often 'clumsy giants' that must be refined through additional techniques like distillation, fine-tuning, instruction tuning, or parameter-efficient tuning."
  },
  {
    term: "pre-training",
    category: "generative AI",
    definition: "The initial training of a model on a large dataset — for example, all English Wikipedia pages. The resulting model is then typically refined through fine-tuning, instruction tuning, distillation, or prompt tuning for specific tasks."
  },
  {
    term: "prompt",
    category: "generative AI",
    definition: "Any text entered as input to an LLM to condition its behavior. Can be a question, instruction, example, role assignment, or partial input. Prompts can be as short as a phrase or arbitrarily long. A generative AI model can respond with text, code, images, embeddings, video, and more."
  },
  {
    term: "prompt engineering",
    category: "generative AI",
    definition: "The art of creating prompts that elicit desired responses from an LLM. Depends on the pre-training dataset, temperature, and other decoding parameters. Includes techniques like chain-of-thought prompting, role prompting, zero-shot, one-shot, and few-shot prompting."
  },
  {
    term: "prompt-based learning",
    category: "generative AI",
    definition: "A capability of models that enables them to adapt their behavior in response to arbitrary text input (prompts), without task-specific retraining. The model draws on broad knowledge from pre-training to respond usefully to novel prompts."
  },
  {
    term: "Reinforcement Learning from Human Feedback (RLHF)",
    category: "generative AI",
    definition: "Using feedback from human raters to improve model response quality. For example, asking users to rate responses with 👍 or 👎 and adjusting future responses based on that feedback."
  },
  {
    term: "role prompting",
    category: "generative AI",
    definition: "A prompt, typically beginning with 'you', that tells a generative AI model to pretend to be a certain person or role when generating responses. Helps the model get into the right 'mindset' to produce more useful answers."
  },
  {
    term: "temperature",
    category: "generative AI",
    definition: "A hyperparameter that controls the degree of randomness of a model's output. Higher temperatures produce more random (creative) output; lower temperatures produce more deterministic output. Choose based on whether the task requires creativity or precision."
  },
  {
    term: "zero-shot prompting",
    category: "generative AI",
    definition: "A prompt that provides no examples of how the LLM should respond — just a question or instruction and the query. The model must rely entirely on knowledge from pre-training. Contrast with one-shot and few-shot prompting."
  }
];

export default GENERATIVE_AI;
