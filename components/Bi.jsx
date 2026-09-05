// components/Bi.jsx
// Server-renderable bilingual text. Both languages ship in the HTML; a CSS rule
// keyed on <html data-lang> shows one. No JavaScript is needed to read the page.
export default function Bi({ el, en, as: Tag = 'span', className = '', ...rest }) {
  return (
    <>
      <Tag lang="el" className={`i18n-el ${className}`.trim()} {...rest}>{el}</Tag>
      <Tag lang="en" className={`i18n-en ${className}`.trim()} {...rest}>{en ?? el}</Tag>
    </>
  );
}
