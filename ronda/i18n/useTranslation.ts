import i18n from "./i18n";

const useTranslation = () => {
  return {
    t: i18n.t.bind(i18n),
  };
};

export default useTranslation;
