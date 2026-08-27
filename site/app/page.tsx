// static export（GitHub Pages）沒有 middleware 可以做語系轉址，
// 用 meta refresh + 連結取代 next/navigation 的 redirect()：
// redirect() 是用 throw 中斷 render，無法連帶輸出 <meta> 這類 fallback 內容，
// 對沒有執行 JS 的使用者（爬蟲等）會停在一片空白。
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const TARGET = `${BASE_PATH}/en`

export default function RootPage() {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${TARGET}`} />
      </head>
      <body>
        <p>
          Redirecting to <a href={TARGET}>{TARGET}</a>…
        </p>
      </body>
    </html>
  )
}
