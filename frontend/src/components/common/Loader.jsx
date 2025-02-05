import { useSelector } from "react-redux";

import ContentLoader from "react-content-loader";

const Loader = () => {
  const isLoading = useSelector((state) => state.loader.loading);

  return isLoading ? (
    <ContentLoader
      speed={3}
      width={476}
      height={300}
      viewBox='0 0 476 300'
      backgroundColor='#6F7278'
      foregroundColor='#ecebeb'
    >
      <rect x='47' y='15' rx='8' ry='8' width='400' height='10' />
      <rect x='0' y='56' rx='3' ry='3' width='650' height='6' />
      <circle cx='20' cy='20' r='20' />
    </ContentLoader>
  ) : null;
};

export default Loader;
