/* =====================================================================
   THE FLOUR STORE — Landing Page
   React + Tailwind CSS + Framer Motion
   Paleta: navy #0E1B2E · flame #FA541C · cream #FFF3E0
   ===================================================================== */
import { useState } from "react";
import { motion } from "framer-motion";

/* ============================ 1. DATOS DE MARCA ======================= */
const BRAND = {
  name: "THE FLOUR STORE",
  slogan: "Ojo de Bife + Pan Artesanal",
  address: "Humahuaca 3853, CABA, Buenos Aires",
  hours: [
    { d: "Lunes a Domingo", h: "18:00 – 24:00 hs" },
    { d: "Sábados (turno extra)", h: "12:00 – 16:00 hs" },
  ],
};

/* ---------- Ubicación: mapa embebido y navegación (sin API key) -------- */
const MAP_ADDRESS = "Humahuaca 3853, CABA, Buenos Aires, Argentina";
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAP_ADDRESS)}&z=16&hl=es&output=embed`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_ADDRESS)}`;

/* ⚠️ Reemplazar por el número real (formato internacional, sin + ni espacios) */
const WA_NUMBER = "5491100000000";
const WA_TEXT = "¡Hola The Flour Store! Quisiera realizar un pedido de hamburguesas.";
const wa = (text = WA_TEXT) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

/* Hamburguesas 1-5 = PNG recortados sin fondo · resto = JPG de ambiente */
const IMG = {
  b1: "img/hamburguesa-1.png",
  b2: "img/hamburguesa-2.png",
  b3: "img/hamburguesa-3.png",
  b4: "img/hamburguesa-4.png",
  b5: "img/hamburguesa-5.png",
  bread: "img/pan.png",
  smash: "img/smash.jpg",
  breakfast: "img/breakfast-meal.jpg",
  sandwich: "img/sandwich.jpg",
  burritos: "img/burritos.jpg",
  fries: "img/papas-fritas.jpg",
};

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Categorías", href: "#categorias" },
  { label: "Ubicación", href: "#ubicacion" },
];

const PRODUCTS = [
  { name: "Double Beef Burger", desc: "Doble ojo de bife, cheddar x2 y pan de papa casero.", price: "$12.900", rating: 4.9, reviews: 128, img: IMG.b1, tag: "Más pedida" },
  { name: "Spicy Beef Burger",  desc: "Ojo de bife, jalapeños frescos y salsa picante ahumada.", price: "$11.500", rating: 4.7, reviews: 94,  img: IMG.b2 },
  /* hamburguesa-3 es vertical (408x612): con el marco a ras del recuadro
     (`top-0 bottom-0`) la foto entra completa y ocupa todo el alto disponible,
     sin salirse del rectángulo navy. */
  { name: "Cheese Beef Burger", desc: "Ojo de bife, triple cheddar y cebolla caramelizada.", price: "$11.900", rating: 4.8, reviews: 112, img: IMG.b3, frame: "top-0 bottom-0" },
  { name: "Combo Cheese Burger",desc: "Burger + papas rústicas + bebida. Ideal para compartir.", price: "$15.900", rating: 4.9, reviews: 76, img: IMG.b4, tag: "Combo" },
];

const CATEGORIES = [
  { title: "Breakfast",    sub: "Combo Meals",  img: IMG.breakfast, items: "6 opciones", span: "lg:col-span-3" },
  { title: "Sandwiches",   sub: "Patty Melts",  img: IMG.sandwich,  items: "5 opciones", span: "lg:col-span-3" },
  { title: "Burritos",     sub: "Wraps",        img: IMG.burritos,  items: "4 opciones", span: "lg:col-span-2" },
  { title: "Papas Fritas", sub: "Sides",        img: IMG.fries,     items: "7 opciones", span: "lg:col-span-2" },
  { title: "Smash",        sub: "A la plancha", img: IMG.smash,     items: "3 opciones", span: "lg:col-span-2" },
];

const BEST = [
  { name: "Double Beef Burger", desc: "Doble medallón de ojo de bife, cheddar fundido y pan de papa recién horneado.", price: "$12.900", rating: 4.9, img: IMG.b1, badge: "Nuevo" },
  { name: "Savory Beef Burger", desc: "Ojo de bife jugoso, morrones asados, pickles y salsa ahumada de la casa.",   price: "$12.400", rating: 4.8, img: IMG.b2, badge: "Top ventas" },
];

/* ======================= 2. ANIMACIONES REUTILIZABLES ================== */
/* Flotación suave continua: translateY de -8px a 8px */
const float = (delay = 0) => ({
  animate: { y: [-8, 8, -8] },
  transition: { duration: 4, ease: "easeInOut", repeat: Infinity, delay },
});
const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: "easeOut" },
};

/* Sombra paralela difuminada bajo la hamburguesa flotante.
   Se centra con `inset-x-0 mx-auto` (no con -translate-x-1/2) porque Framer Motion
   escribe el `transform` inline al animar scaleX/opacity y pisaría la clase.
   La posición se pasa por prop: dos utilidades `bottom-*` a la vez no se sobrescriben. */
const FloorShadow = ({ className = "", bottom = "bottom-4" }) => (
  <motion.span
    aria-hidden
    animate={{ scaleX: [1, 0.86, 1], opacity: [0.55, 0.35, 0.55] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className={`pointer-events-none absolute inset-x-0 ${bottom} mx-auto h-6 w-3/5 rounded-[50%] bg-black/60 blur-2xl ${className}`}
  />
);

const Stars = ({ rating }) => (
  <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy/70">
    <span className="text-flame" aria-hidden>★★★★★</span>
    {rating}
  </span>
);

/* ======================= 3. BOTONES ================================== */
const WaIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.13-.42-2.15-1.33-.8-.71-1.33-1.59-1.48-1.89-.15-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.37 2.98 1.17 2.98.78 3.52.73.54-.05 1.75-.71 1.99-1.4.25-.69.25-1.28.18-1.4-.08-.13-.28-.2-.58-.35z" />
    <path d="M12.04 2C6.6 2 2.17 6.43 2.17 11.87c0 1.74.46 3.44 1.32 4.93L2 22l5.35-1.4a9.85 9.85 0 0 0 4.69 1.2h.01c5.43 0 9.86-4.43 9.86-9.87 0-2.64-1.03-5.11-2.89-6.97A9.8 9.8 0 0 0 12.04 2zm0 17.98h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.16 8.16 0 0 1-1.25-4.35c0-4.52 3.68-8.19 8.2-8.19 2.19 0 4.25.85 5.8 2.4a8.14 8.14 0 0 1 2.4 5.8c0 4.52-3.68 8.18-8.2 8.18z" />
  </svg>
);

const WaButton = ({ children, text, className = "", ...rest }) => (
  <a
    href={wa(text)}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-bold text-white shadow-soft transition-transform duration-300 hover:-translate-y-[3px] hover:brightness-110 active:translate-y-0 ${className}`}
    {...rest}
  >
    <WaIcon className="h-4 w-4" />
    {children}
  </a>
);

/* ============================ 4. PAGE ================================ */
export default function App() {
  return (
    <div className="min-h-screen bg-navy font-sans text-white antialiased">
      <Header />
      <main>
        <Hero />
        <MenuGrid />
        <HomeMade />
        <Categories />
        <KingBurger />
        <BestMenu />
        <Location />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

/* ======================= 5. HEADER STICKY (glass) ==================== */
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-flame font-display text-lg leading-none text-white">F</span>
          <span className="leading-none">
            <span className="block font-display text-lg tracking-wide">THE FLOUR STORE</span>
            <span className="hidden text-[11px] font-medium text-cream/70 sm:block">{BRAND.slogan}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-white/80 transition-colors hover:text-flame">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold text-cream/80 lg:block">
            ⏱ Lun-Dom 18-24 hs · Sáb 12-16 hs
          </span>
          <WaButton className="hidden sm:inline-flex" text={WA_TEXT}>Pedir</WaButton>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 md:hidden"
          >
            <span className="text-xl leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="overflow-hidden border-t border-white/10 bg-navy/95 px-5 md:hidden"
        >
          <div className="flex flex-col py-3">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)}
                 className="border-b border-white/5 py-3 text-sm font-semibold text-white/85 last:border-0">
                {n.label}
              </a>
            ))}
            <WaButton className="mt-4" text={WA_TEXT}>Pedir por WhatsApp</WaButton>
          </div>
        </motion.nav>
      )}
    </header>
  );
}

/* ======================= 6. HERO ===================================== */
function Hero() {
  return (
    <section id="home" className="relative scroll-mt-28 overflow-hidden bg-navy">
      {/* Fondo del Hero con la imagen del pan artesanal aplicada por CSS
          (background-image + cover + center) y velo navy encima para que el
          texto mantenga contraste, más oscuro del lado izquierdo donde va el copy. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20 sm:opacity-25"
        style={{
          backgroundImage: `url('${IMG.bread}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/60" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/70" />

      <div aria-hidden className="pointer-events-none absolute -top-32 right-0 h-[520px] w-[520px] rounded-full bg-flame/20 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-flameAlt/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
        {/* ------------- Columna izquierda ------------- */}
        <motion.div {...fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full border border-flame/40 bg-flame/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-flame">
            🔥 Humahuaca 3853 · Buenos Aires
          </span>

          <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            SAVORY &amp; <span className="text-flame">DELICIOUS</span>
            <span className="mt-3 block font-sans text-2xl font-semibold tracking-normal text-cream sm:text-3xl">
              OJO DE BIFE + PAN ARTESANAL
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
            Pan de papa horneado en casa, medallones 100% ojo de bife y salsas de autor.
            Pedí por WhatsApp y retirá o recibí en la puerta.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <WaButton text={WA_TEXT} className="!bg-flame px-8 py-4 text-base hover:!bg-flameAlt">
              Pedir por WhatsApp
            </WaButton>
            <a href="#menu"
               className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white/85 transition-colors hover:border-flame hover:text-flame">
              Ver Menú / Delivery
            </a>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {[["100%", "Ojo de bife"], ["4.9★", "+430 reseñas"], ["15 min", "Retiro en local"]]
              .map(([k, v]) => (
                <div key={v}>
                  <dt className="font-display text-2xl text-flame">{k}</dt>
                  <dd className="text-[11px] font-medium uppercase tracking-wide text-white/55">{v}</dd>
                </div>
              ))}
          </dl>
        </motion.div>

        {/* ------------- Columna derecha: composición en cuadrícula ------------- */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}
                    className="mx-auto grid w-full max-w-xl grid-cols-2 items-stretch gap-4">
          {/* Tarjeta destacada: la hamburguesa queda centrada (mismo eje vertical que
              el grid) y contenida dentro de la tarjeta, apoyada sobre su sombra. */}
          <div className="relative col-span-2 grid h-72 place-items-center rounded-[2rem] bg-navySoft sm:h-80">
            <div aria-hidden className="absolute inset-0 rounded-[2rem] ring-1 ring-white/10" />
            <div aria-hidden className="absolute top-8 h-48 w-48 rounded-full bg-flame/25 blur-3xl sm:h-56 sm:w-56" />
            <motion.img
              {...float(0)}
              src={IMG.b1}
              alt="Hamburguesa insignia de The Flour Store: doble ojo de bife con cheddar y pan de sésamo"
              className="relative z-10 mx-auto h-[74%] w-auto max-w-[78%] object-contain object-bottom drop-shadow-[0_35px_35px_rgba(0,0,0,.55)] sm:h-[78%]"
            />
            <FloorShadow className="bottom-8" />
            <span className="absolute left-5 top-5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cream backdrop-blur-md">
              Insignia
            </span>
          </div>

          {/* Ambas tarjetas inferiores comparten alto y eje de texto: los números
              "18–24" y "4.9" quedan alineados en la misma línea base. */}
          <div className="flex flex-col justify-center rounded-[2rem] bg-flame p-6 text-white shadow-soft">
            <p className="font-display text-4xl leading-none">18–24</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/85">
              Abierto todos los días
            </p>
          </div>

          {/* Rating promedio: la hamburguesa decorativa va dentro de la tarjeta,
              más grande y corrida hacia la izquierda para ganar presencia visual. */}
          <div className="relative flex flex-col justify-center overflow-hidden rounded-[2rem] bg-cream p-6 text-navy shadow-soft">
            <motion.img
              {...float(0.6)}
              src={IMG.b3}
              alt="Hamburguesa con salsa y pickles"
              className="pointer-events-none absolute right-8 top-3 h-24 w-auto object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,.35)] sm:right-10 sm:h-28"
            />
            <p className="font-display text-4xl leading-none">4.9</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-navy/60">
              Rating promedio
            </p>
            <p className="mt-1 text-lg text-flame" aria-hidden>★★★★★</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ======================= 7. GRID NARANJA DE MENÚ ===================== */
function MenuGrid() {
  return (
    <section id="menu" className="relative scroll-mt-28 bg-flame py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
              Home Online Burgers
            </p>
            <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
              NUESTRAS HAMBURGUESAS
            </h2>
          </div>
          <a href={wa("¡Hola The Flour Store! Quisiera ver el menú completo.")} target="_blank" rel="noopener noreferrer"
             className="rounded-full border border-white/40 px-6 py-3 text-sm font-bold transition-colors hover:bg-white hover:text-flame">
            Ver menú completo →
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <motion.article
              key={p.name}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="group relative flex flex-col rounded-[1.75rem] bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-[5px] hover:shadow-burger"
            >
              {p.tag && (
                <span className="absolute right-4 top-4 z-20 rounded-full bg-flame px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  {p.tag}
                </span>
              )}

              {/* Bloque de imagen con ALTO DEFINIDO: las fotos tienen proporciones muy
                  distintas entre sí (hamburguesa-3 es vertical, 408x612), así que el marco
                  se posiciona en absoluto —con altura resuelta— y la imagen se ajusta con
                  `object-contain`: nunca tapa el nombre ni la descripción, y con el marco
                  por dentro del recuadro la foto queda siempre contenida en él.
                  La caja es h-52 para que las fotos verticales puedan verse grandes. */}
              <div className="relative mb-6 h-52 rounded-[1.25rem] bg-navy">
                <div aria-hidden className="absolute inset-x-6 top-6 h-24 rounded-full bg-flame/25 blur-2xl" />
                <div className={`absolute inset-x-0 transition-transform duration-500 group-hover:scale-[1.05] ${p.frame ?? "-top-2 bottom-0"}`}>
                  <motion.img
                    {...float(i * 0.35)}
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-contain object-bottom drop-shadow-[0_25px_28px_rgba(0,0,0,.55)]"
                  />
                </div>
                <span aria-hidden className="pointer-events-none absolute bottom-2 left-1/2 h-3 w-1/2 -translate-x-1/2 rounded-[50%] bg-black/50 blur-lg" />
              </div>

              <h3 className="font-display text-xl leading-tight text-navy">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/60">{p.desc}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-2xl text-navy">{p.price}</span>
                <Stars rating={p.rating} />
              </div>
              <p className="mt-1 text-[11px] text-navy/45">{p.reviews} reseñas</p>

              <WaButton text={`¡Hola The Flour Store! Quisiera pedir una ${p.name}.`} className="mt-4 w-full !bg-navy hover:!bg-flame">
                Pedir Now
              </WaButton>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================= 8. HOME MADE / NOSOTROS ===================== */
function HomeMade() {
  const metrics = [
    { k: "100%", v: "Ojo de Bife",        d: "Corte vacuno seleccionado, sin rellenos ni soja." },
    { k: "H3853", v: "Humahuaca 3853",    d: "Buenos Aires. Retiro en local y delivery en la zona." },
    { k: "PAN",  v: "Pan de Papa Casero", d: "Amasado y horneado todos los días en casa." },
  ];

  return (
    <section id="nosotros" className="scroll-mt-28 bg-cream py-20 text-navy">
      <div className="mx-auto max-w-7xl px-5">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-flame">We From Home Made</p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            TODO CASERO, TODO A LA PLANCHA
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy/65">
            Smasheamos el ojo de bife en plancha caliente para sellar los jugos y servimos
            sobre pan de papa hecho en el día. Sin atajos.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <motion.div {...fadeUp}
            className="relative col-span-2 min-h-[320px] overflow-hidden rounded-[2rem] bg-navy">
            <img src={IMG.smash} alt="Proceso de smash del ojo de bife en la plancha"
                 className="absolute inset-0 h-full w-full object-cover opacity-90" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-7">
              <span className="w-fit rounded-full bg-flame px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Smash en vivo
              </span>
              <h3 className="mt-4 font-display text-3xl leading-tight text-white">
                EL SELLADO QUE HACE LA DIFERENCIA
              </h3>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-creamDeep p-7">
            <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-flame/25 blur-3xl" />
            <div className="relative">
              <h3 className="font-display text-2xl leading-tight">PAN DE PAPA, HORNEADO HOY</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/65">
                Masa tierna, dorada al huevo y terminada con sésamo.
              </p>
            </div>
            {/* La tarjeta usa la foto del pan (PAN.PNG, 1015x1024). El marco tiene alto
                definido y la imagen va con `h-full w-auto`: así el elemento adopta la
                proporción real de la foto (sin recorte ni deformación), queda centrado
                y las esquinas redondeadas se aplican sobre la foto misma. */}
            <div className="relative mt-6 h-44">
              <div className="absolute inset-x-0 -top-3 bottom-0 flex justify-center">
                <motion.img
                  {...float(0.2)}
                  src={IMG.bread}
                  alt="Pan de papa artesanal horneado en casa"
                  className="h-full w-auto rounded-[1.25rem] object-cover object-center drop-shadow-[0_30px_30px_rgba(0,0,0,.45)]"
                />
              </div>
              <FloorShadow bottom="bottom-0" className="bg-navy/40" />
            </div>
          </motion.div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {metrics.map((m, i) => (
            <motion.div key={m.v} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="rounded-[2rem] border border-navy/10 bg-white/70 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-[5px] hover:shadow-soft">
              <p className="font-display text-3xl text-flame">{m.k}</p>
              <p className="mt-2 font-display text-lg">{m.v}</p>
              <p className="mt-2 text-sm leading-relaxed text-navy/60">{m.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================= 9. BENTO DE CATEGORÍAS (oscuro) ============= */
function Categories() {
  return (
    <section id="categorias" className="scroll-mt-28 bg-navy py-20">
      <div className="mx-auto max-w-7xl px-5">
        <motion.div {...fadeUp} className="mb-12 max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-flame">Explorá la carta</p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">CATEGORÍAS RÁPIDAS</h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {CATEGORIES.map((c, i) => (
            <motion.a
              key={c.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              href={wa(`¡Hola The Flour Store! Quisiera pedir de la categoría ${c.title}.`)}
              target="_blank" rel="noopener noreferrer"
              className={`group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[2rem] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-[5px] hover:ring-flame/50 ${c.span}`}
            >
              <img src={c.img} alt={c.title}
                   className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/10" />
              <div className="relative p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-flame">{c.sub}</p>
                <h3 className="mt-1 font-display text-2xl leading-tight text-white">{c.title}</h3>
                <p className="mt-1 text-xs text-white/60">{c.items}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================= 10. BANNER THE KING BURGER ================== */
function KingBurger() {
  return (
    <section className="relative overflow-hidden">
      <img src={IMG.smash} alt="" aria-hidden
           className="absolute inset-0 h-full w-full object-cover" />
      <div aria-hidden className="absolute inset-0 bg-navy/85" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-transparent" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-5 py-20 lg:flex-row lg:justify-between">
        <motion.div {...fadeUp} className="max-w-xl text-center lg:text-left">
          <span className="inline-block rounded-full bg-flame px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            Edición limitada
          </span>
          <h2 className="mt-5 font-display text-5xl leading-[0.95] sm:text-6xl">
            THE KING <span className="text-flame">BURGER</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            Triple ojo de bife, cheddar madurado, cebolla caramelizada y salsa de la casa.
            Solo viernes y sábados, hasta agotar stock.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <WaButton text="¡Hola The Flour Store! Quisiera reservar la King Burger." className="px-8 py-4 text-base">
              Reservar la King Burger
            </WaButton>
            <span className="font-display text-3xl text-cream">$18.900</span>
          </div>
        </motion.div>

        <div className="relative grid h-72 w-full max-w-md place-items-center lg:h-80">
          <div aria-hidden className="absolute h-64 w-64 rounded-full bg-flame/20 blur-3xl" />
          <motion.img
            {...float(0.4)}
            src={IMG.b4}
            alt="The King Burger: triple ojo de bife con cheddar"
            className="relative z-10 h-[120%] w-auto object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.6)]"
          />
          <FloorShadow bottom="bottom-2" />
        </div>
      </div>
    </section>
  );
}

/* ======================= 11. BEST MENU / LANZAMIENTOS ================ */
function BestMenu() {
  return (
    <section className="bg-cream py-20 text-navy">
      <div className="mx-auto max-w-7xl px-5">
        <motion.div {...fadeUp} className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-flame">Best Menu In Year</p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              LOS MÁS PEDIDOS DEL AÑO
            </h2>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-navy/15 text-navy/50">←</span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-flame text-white">→</span>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {BEST.map((b, i) => (
            <motion.article key={b.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="group grid items-center gap-6 overflow-hidden rounded-[2rem] bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-[5px] hover:shadow-burger sm:grid-cols-[minmax(0,240px)_1fr]">
              {/* Marco de alto definido: las dos tarjetas comparten caja y encuadre
                  (`object-contain`), así las hamburguesas quedan alineadas entre sí.
                  Savory Beef Burger (foto más vertical) baja 12px dentro de su marco. */}
              <div className="relative h-56 overflow-hidden rounded-[1.5rem] bg-navy">
                <div aria-hidden className="absolute inset-x-8 top-8 h-24 rounded-full bg-flame/25 blur-2xl" />
                <div className={`absolute inset-0 transition-transform duration-500 group-hover:scale-[1.05] ${i === 1 ? "translate-y-[12px]" : ""}`}>
                  <motion.img {...float(i * 0.4)} src={b.img} alt={b.name}
                    className="h-[90%] w-full object-contain drop-shadow-[0_28px_30px_rgba(0,0,0,.55)]" />
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-flame px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  {b.badge}
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl leading-tight">{b.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy/65">{b.desc}</p>
                <div className="mt-4 flex items-center gap-3">
                  <Stars rating={b.rating} />
                  <span className="text-xs text-navy/40">·</span>
                  <span className="text-xs font-semibold text-navy/50">Disponible hoy</span>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <span className="font-display text-3xl text-flame">{b.price}</span>
                  <WaButton text={`¡Hola The Flour Store! Quisiera pedir una ${b.name}.`} className="!bg-navy hover:!bg-flame">
                    Pedir Now
                  </WaButton>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================= 12. UBICACIÓN / MAPA ======================== */
function Location() {
  return (
    <section id="ubicacion" className="scroll-mt-28 bg-navy pb-20 pt-20">
      <div className="mx-auto max-w-7xl px-5">
        <motion.div {...fadeUp} className="mb-12 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-flame">Visitános</p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            UBICACIÓN Y HORARIOS
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Te esperamos en {BRAND.address}. Retiro en el local y delivery en la zona.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
          {/* ---------------- Horarios + CTA ---------------- */}
          <motion.div {...fadeUp} className="rounded-[2rem] bg-cream p-7 text-navy shadow-soft">
            <div className="flex items-center gap-3">
              <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-flame text-lg text-white">
                ⏱
              </span>
              <h3 className="font-display text-2xl leading-none">HORARIOS</h3>
            </div>

            <ul className="mt-6 space-y-5">
              {BRAND.hours.map((h) => (
                <li key={h.d} className="border-b border-navy/10 pb-4 last:border-0 last:pb-0">
                  <span className="block text-sm font-semibold text-navy/70">{h.d}</span>
                  <span className="mt-1 block font-display text-2xl leading-none text-flame">{h.h}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-3 rounded-[1.25rem] bg-navy/5 p-4">
              <span aria-hidden className="text-lg leading-none">📍</span>
              <p className="text-sm font-semibold leading-relaxed text-navy/75">{BRAND.address}</p>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-navy/55">
              Últimos pedidos 30 minutos antes del cierre. Los sábados abrimos también al mediodía.
            </p>

            <a
              href={MAP_DIRECTIONS}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-4 text-sm font-bold text-white shadow-soft transition-all duration-300 hover:-translate-y-[3px] hover:bg-flame"
            >
              <span aria-hidden>🧭</span> Cómo llegar
            </a>

            <WaButton className="mt-3 w-full" text={WA_TEXT}>Pedir por WhatsApp</WaButton>
          </motion.div>

          {/* ---------------- Mapa interactivo ---------------- */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.12 }}
            className="overflow-hidden rounded-[2rem] bg-navySoft shadow-soft ring-1 ring-white/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-flame text-white">📍</span>
                <span className="leading-tight">
                  <span className="block font-display text-base tracking-wide">{BRAND.name}</span>
                  <span className="block text-xs text-white/60">{BRAND.address}</span>
                </span>
              </div>
              <a
                href={MAP_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/25 px-5 py-2 text-xs font-bold text-white/85 transition-colors hover:border-flame hover:text-flame"
              >
                Abrir en Google Maps →
              </a>
            </div>

            <iframe
              title="Mapa de The Flour Store — Humahuaca 3853, CABA, Buenos Aires"
              src={MAP_EMBED}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[320px] w-full border-0 sm:h-[420px] lg:h-[460px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ======================= 13. FOOTER / NEWSLETTER ===================== */
function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail("");
  };

  const links = ["Instagram", "Facebook", "TikTok", "PedidosYa"];

  return (
    <footer className="bg-flame pt-20 text-white">
      <div className="mx-auto max-w-7xl px-5">
        <motion.div {...fadeUp}
          className="grid items-center gap-8 rounded-[2rem] bg-flameAlt/95 p-8 shadow-soft lg:grid-cols-2 lg:p-12">
          <div>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              SUMATE AL CLUB THE FLOUR
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
              Promos exclusivas, lanzamientos de temporada y la King Burger antes que nadie.
            </p>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="news-email">Tu email</label>
            <input
              id="news-email"
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setSent(false); }}
              placeholder="tucorreo@email.com"
              className="w-full rounded-full border border-white/30 bg-white/15 px-6 py-4 text-sm text-white placeholder:text-white/60 outline-none backdrop-blur-md transition focus:border-white focus:bg-white/25"
            />
            <button type="submit"
              className="shrink-0 rounded-full bg-navy px-8 py-4 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-[3px]">
              {sent ? "¡Listo! ✓" : "Suscribirme"}
            </button>
          </form>
        </motion.div>

        <div className="mt-16 grid gap-10 border-t border-white/20 pt-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white font-display text-lg text-flame">F</span>
              <span className="font-display text-xl tracking-wide">{BRAND.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              {BRAND.slogan}. Hamburguesas artesanales en el corazón de Buenos Aires.
            </p>
            <WaButton className="mt-6 !bg-navy hover:!bg-navy/85">Escribinos por WhatsApp</WaButton>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.16em] text-white/90">Horarios</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {BRAND.hours.map((h) => (
                <li key={h.d}>
                  <span className="block font-semibold text-white">{h.d}</span>
                  {h.h}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.16em] text-white/90">Dónde estamos</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/80">{BRAND.address}</p>
            <a
              href="#ubicacion"
              className="mt-3 inline-block text-sm font-bold text-navy underline decoration-2 underline-offset-4 transition-colors hover:text-white"
            >
              Ver mapa y cómo llegar
            </a>
            <ul className="mt-5 space-y-2 text-sm">
              {links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-white/80 transition-colors hover:text-navy">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/20 py-7 text-xs text-white/70 sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. Todos los derechos reservados.</p>
          <p>Lun-Dom 18-24 hs · Sáb 12-16 hs | {BRAND.address}</p>
          <p className="font-bold uppercase tracking-[0.14em] text-white">Powered por Ignacio Villa</p>
        </div>
      </div>
    </footer>
  );
}

/* ======================= 14. BOTÓN FLOTANTE WHATSAPP ================= */
function FloatingWhatsApp() {
  return (
    <a
      href={wa(WA_TEXT)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pedir por WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid h-16 w-16 place-items-center rounded-full bg-whatsapp text-white shadow-burger transition-transform duration-300 hover:scale-110"
    >
      <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-whatsapp/60" />
      <span aria-hidden className="absolute inset-0 animate-pulse rounded-full bg-whatsapp/40" />
      <WaIcon className="relative h-8 w-8" />
    </a>
  );
}
