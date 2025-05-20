import './header-footer.css';

const socials = [
  {
    name: "GitHub",
    url: "https://github.com/ikernvs",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/iker-navas-886389252/",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/ikernvs/",
  },
];

const Footer = () => (
  <footer className="border-t border-neutral-800 py-8 text-gray-400 bg-gradient-to-r from-[#1a1c22] via-[#1a1c22] to-[#25292e]">
    <div className="max-w-7xl mx-auto px-4 flex flex-col gap-6 md:gap-0 md:grid md:grid-cols-3 items-center">
      {/* Columna izquierda: copyright */}
      <div className="text-center md:text-left">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Ikernvs<br className="block md:hidden" />
          <span className="hidden md:inline"> — All rights reserved</span>
        </p>
      </div>

      {/* Columna central: enlaces sociales separados */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="text-gray-400 hover:text-[#C84153] transition-colors duration-300 underline text-base sm:text-sm"
          >
            {social.name}
          </a>
        ))}
      </div>

      {/* Columna derecha: contacto */}
      <div className="text-center md:text-right text-xs text-gray-500">
        <span>
          Contact: <a href="mailto:ikernavasgarcia00@gmail.com" className="underline hover:text-[#C84153]">ikernavasgarcia00@gmail.com</a>
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
