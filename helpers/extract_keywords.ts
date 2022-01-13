import mammoth from 'mammoth'
import { retext } from 'retext'
import retextKeywords from 'retext-keywords'
import retextPos from 'retext-pos'

export const exctractKeywordsMap = async (file: File, fileUrl: string) => {
  const ab = await file.arrayBuffer()

  const raw =
    file.type === 'text/plain'
      ? await readTxtFile(file)
      : await mammoth
          .extractRawText({ arrayBuffer: ab })
          .then((res) => res.value)

  const keywords = await retext()
    .use(retextPos)
    .use(retextKeywords)
    .process(raw)
    .then((file) => {
      const keywords = []
      ;(file.data.keywords as { stem: string; score: number }[]).forEach(
        (keyword) => {
          keywords.push({
            keyname: keyword.stem,
            score: keyword.score,
            document: fileUrl
          })
        }
      )
      return keywords
    })

  return keywords
}

const readTxtFile = (file: File) => {
  return new Promise((resolve: (res: string) => void, reject) => {
    const fr = new FileReader()
    fr.onload = () => {
      resolve(fr.result as string)
    }
    fr.onerror = reject
    fr.readAsText(file)
  })
}
