const Footer = () => {
  return (
    <footer className='row-start-3 flex px-8 py-6 items-center justify-between'>
      <p className='text-sm text-gray-400'>
        InvoManager &copy; {new Date().getFullYear()}
      </p>
      <div className=''></div>
    </footer>
  );
};
export default Footer;
