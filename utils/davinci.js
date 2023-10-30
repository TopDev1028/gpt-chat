const { ConversationChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} = require("langchain/prompts");
const { BufferMemory } = require("langchain/memory");

const OPENAI_KEY = process.env.OPENAI_KEY;

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "history",
});

const davinci = async function (prompt, gptVersion) {
  const chatPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context and always responds in markdown format. If the AI does not know the answer to a question, it truthfully says it does not know."
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);
  const model = new ChatOpenAI({
    openAIApiKey: OPENAI_KEY,
    model: gptVersion === "3.5" ? "gpt-3.5-turbo" : "gpt-4",
    temperature: 0.3,
  });

  const chain = new ConversationChain({
    memory: memory,
    prompt: chatPrompt,
    llm: model,
  });

  const response = await chain.call({ input: prompt });

  return response.response;
};

module.exports = davinci;
