import { useLang } from '../context/LangContext';

export default function LangText({ hi, en }) {
  const { lang } = useLang();
  const content = lang === 'hi' ? (hi ?? en) : (en ?? hi);
  return <>{content ?? ''}</>;
}
