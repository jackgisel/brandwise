import classNames from 'classnames';

const LogoImage: React.FCC<{
  className?: string;
}> = ({ className }) => {
  return (
    <img src="/assets/images/brandwise-dark-mode.png" alt="brandwise logo" />
  );
};

export default LogoImage;
