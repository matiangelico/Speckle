import ContentLoader from "react-content-loader";

const Loader = () => {
  return (
    <ContentLoader
      speed={3}
      width={476}
      height={300}
      viewBox='0 0 476 300'
      backgroundColor='#080A11'
      foregroundColor='#ecebeb'
    >
      <rect x='48' y='8' rx='3' ry='3' width='88' height='6' />
      <rect x='48' y='26' rx='3' ry='3' width='52' height='6' />
      <rect x='0' y='56' rx='3' ry='3' width='410' height='6' />
      <rect x='0' y='72' rx='3' ry='3' width='380' height='6' />
      <rect x='0' y='88' rx='3' ry='3' width='178' height='6' />
      {/* <circle cx='20' cy='20' r='20' /> */}
      <path d='M 4.81 11.224 L 20 2.444 l 15.19 8.78 v 17.552 L 20 37.556 l -15.19 -8.78 V 11.224 z m 3.157 1.802 v 13.948 L 20 33.874 l 12.033 -6.9 V 13.026 L 20 6.084 L 7.967 13.026 z' />
    </ContentLoader>
  );
};

export default Loader;
