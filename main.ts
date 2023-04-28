import axios from "axios"

const submitButton = document.getElementById("submit")
const apiKeyInput = document.getElementById("api-key") as HTMLInputElement

const promptInput = document.getElementById("prompt") as HTMLInputElement
const resultSection = document.getElementById("result")
const resultText = document.getElementById("result-txt")


window.onload = () => {
  if (import.meta.env.VITE_OPENAI_API_KEY)
  apiKeyInput.value = import.meta.env.VITE_OPENAI_API_KEY
}

type ModerationResultResponse = {
  id: string,
    model: string,
    results: {
      categories: {
        hate: boolean
        "hate/threatening": boolean
        "self-harm": boolean
        sexual: boolean
        "sexual/minors": boolean
        violence: boolean
        "violence/graphic": boolean
      },
      category_scores: ModerationCategoryScore,
      flagged: boolean
    }[]
}

type ModerationCategoryScore = {
  hate: number
  "hate/threatening": number
  "self-harm": number
  sexual: number
  "sexual/minors": number
  violence: number
  "violence/graphic": number
}

if(submitButton) submitButton.onclick = async () => {

  const promptText = promptInput.value
  if (!promptText) return
  const { data } = await axios.post<ModerationResultResponse>("https://api.openai.com/v1/moderations", {
    input: promptText
  }, {
    headers: {
      Authorization: `Bearer ${apiKeyInput.value}`
    }
  })
  if (resultSection) resultSection.style.display = "block"
  setValue(data.results[0].category_scores)

  if (resultText) resultText.innerHTML = JSON.stringify(data, null, 2)
}

const setValue = (categoryScore: ModerationCategoryScore) => {
  for (const key in categoryScore) {
    const valueString = `${categoryScore[key] * 100}%`
    const keyId = key.replace("/", "-")
    document.getElementById(`${keyId}-value`).innerHTML = valueString
    document.getElementById(`${keyId}-graph`).style.width = valueString
  }
}
