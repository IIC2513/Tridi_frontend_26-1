import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ScrollProgressBar from "../../components/ScrollProgressBar/ScrollProgressBar";
import "./DocsPage.css";

const NAV_SECTIONS = [
  { id: "welcome",   number: "01", title: "Welcome" },
  { id: "catalogue", number: "02", title: "The catalogue" },
  { id: "viewer",    number: "03", title: "Viewing models" },
  { id: "account",   number: "04", title: "Your account" },
  { id: "cart",      number: "05", title: "The cart" },
  { id: "foryou",    number: "06", title: "For You" },
  { id: "help",      number: "07", title: "Need help?" },
];

export default function DocsPage() {
  const [activeId, setActiveId] = useState(NAV_SECTIONS[0].id);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  return (
    <>
      <ScrollProgressBar />
      <Navbar />

      <main className="docsPage">
        <aside className="docsSidebar">
          <span className="docsSidebarLabel">On this page</span>
          <nav className="docsNav">
            <ul>
              {NAV_SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`docsNavLink ${activeId === s.id ? "active" : ""}`}
                    onClick={() => handleNavClick(s.id)}
                  >
                    <span className="docsNavNumber">{s.number}</span>
                    <span className="docsNavTitle">{s.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="docsContent">
          <div className="docsHero">
            <span className="docsKicker">A guide to Tridi</span>
            <h1 className="docsTitle">Docs</h1>
            <div className="docsTitleUnderline" />
            <p className="docsLede">
              Don't understand something? These docs shall provide for you 
              a guide on how to browse our site. Written for real users, not programmers.
            </p>
          </div>

          <article className="docsArticle">
            <section id="welcome" ref={setRef("welcome")} className="docsSection">
              <div className="docsSectionHeader">
                <span className="docsSectionNumber">01</span>
                <h2 className="docsSectionTitle">Welcome</h2>
              </div>
              <p className="docsParagraph">
                Tridi is a marketplace for 3D models, built by artists for everyone
                who needs them sculpt lovers, game developers, animators, students, albeit we 
                tend to focus more on the artistry than the utility.
              </p>
              <p className="docsParagraph">
                This guide walks through the parts of the site you'll actually use.
                Read it top to bottom, or jump to a section using the menu on the
                left.
              </p>
            </section>

            <section id="catalogue" ref={setRef("catalogue")} className="docsSection">
              <div className="docsSectionHeader">
                <span className="docsSectionNumber">02</span>
                <h2 className="docsSectionTitle">The catalogue</h2>
              </div>
              <p className="docsParagraph">
                The <Link to="/catalogue" className="docsLink">catalogue</Link> is
                where every model lives. Three controls help you find what you're
                after:
              </p>
              <ul className="docsList">
                <li>
                  <strong>Search:</strong> The bar at the top of the sidebar matches
                  against model names.
                </li>
                <li>
                  <strong>Filters:</strong> Below the search, narrow by software
                  (Blender, ZBrush) and style (Realistic, Stylized, Low-Poly).
                  Filters stack you can pick as many as you like. But be careful! Some filters 
                  are not compatible with others (e.g picking many softwares).
                </li>
                <li>
                  <strong>Sort:</strong> The menu at the top right reorders results
                  by newest, oldest, or price ascending / descending.
                </li>
              </ul>
              <div className="docsCallout">
                <span className="docsCalloutLabel">Tip</span>
                <p>
                  Filters and search work together. Filtering by "Blender" and
                  searching "dragon" shows only dragons made on Blender (or at least models with dragon on the name).
                </p>
              </div>
            </section>

            <section id="viewer" ref={setRef("viewer")} className="docsSection">
              <div className="docsSectionHeader">
                <span className="docsSectionNumber">03</span>
                <h2 className="docsSectionTitle">Viewing models</h2>
              </div>
              <p className="docsParagraph">
                Every product card shows the model rendered live in 3D, not a
                photo, the real geometry (you can do this while in the catalogue page!). The model rotates on its own until you
                take control.
              </p>
              <ul className="docsList">
                <li><strong>Drag</strong> to rotate.</li>
                <li><strong>Scroll</strong> to zoom in or out.</li>
                <li><strong>Right-click and drag</strong> to pan.</li>
              </ul>
              <p className="docsParagraph">
                Click the card to open the model's product page, where you'll find
                a larger viewer, the artist's name, the price, and the available
                formats.
              </p>
            </section>

            <section id="account" ref={setRef("account")} className="docsSection">
              <div className="docsSectionHeader">
                <span className="docsSectionNumber">04</span>
                <h2 className="docsSectionTitle">Your account</h2>
              </div>
              <p className="docsParagraph">
                You can browse Tridi without signing in. An account unlocks purchasing,
                favorites, purchase history, downloads, and the personalized{" "}
                For You feed.
              </p>
              <p className="docsParagraph">
                New here? Head to{" "}
                <Link to="/register" className="docsLink">Create an account</Link>{" "}
                it takes under a minute and asks only for your name, email, and a
                password. Already have one?{" "}
                <Link to="/login" className="docsLink">Sign in</Link>.
              </p>
              <div className="docsCallout">
                <span className="docsCalloutLabel">Note</span>
                <p>
                  Sessions persist on this device until you sign out. Use the
                  Logout button in the top right when you're done.
                </p>
              </div>
            </section>

            <section id="cart" ref={setRef("cart")} className="docsSection">
              <div className="docsSectionHeader">
                <span className="docsSectionNumber">05</span>
                <h2 className="docsSectionTitle">The cart</h2>
              </div>
              <p className="docsParagraph">
                Add a model to your cart from its product page. The Cart button in
                the top right of the navbar shows everything you've added so far.
                Items stay in your cart between visits, so you can leave and come
                back.
              </p>
              <p className="docsParagraph">
                Once you check out, your purchased files appear under{" "}
                <strong>Account → Downloads</strong>, ready to grab in any format
                the artist provided (for now this is just GLB).
              </p>
            </section>

            <section id="foryou" ref={setRef("foryou")} className="docsSection">
              <div className="docsSectionHeader">
                <span className="docsSectionNumber">06</span>
                <h2 className="docsSectionTitle">For You</h2>
              </div>
              <p className="docsParagraph">
                <em>For You</em> is a personalized feed based on what you've
                viewed, favorited, and bought. The more you browse, the better it
                gets (Be warned, we're not machine learning experts, so don't expect too much).
              </p>
            </section>

            <section id="help" ref={setRef("help")} className="docsSection">
              <div className="docsSectionHeader">
                <span className="docsSectionNumber">07</span>
                <h2 className="docsSectionTitle">Need help?</h2>
              </div>
              <p className="docsParagraph">
                We're a small team and we read every message.
              </p>

              <details className="docsFaq">
            <summary>How do I reset my password?</summary>
            <p>
                On the <Link to="/login" className="docsLink">login page</Link>, click{" "}
                <em>Forgotten your password?</em> and follow the email instructions.
            </p>
            </details>
              <details className="docsFaq">
                <summary>What 3D formats does Tridi support?</summary>
                <p>
                  For now, the models available are only of GLB format. Stay tuned though!
                  We will add more on the future :)
                </p>
              </details>
              <details className="docsFaq">
                <summary>Can I use a purchased model commercially?</summary>
                <p>
                  Each model lists its license on the product page. Most are fine
                  for commercial use, some are personal-use only.
                </p>
              </details>
              <details className="docsFaq">
                <summary>Something looks broken. Where do I report it?</summary>
                <p>
                  Email <a href="mailto:contact@tridi.com" className="docsLink">contact@tridi.com</a>{" "}
                  with a screenshot and what you were trying to do.
                </p>
              </details>
            </section>

            <div className="docsEnd">
              <span className="docsEndMark">Fin.</span>
              <p>That's the whole site. Go buy somehing, we're broke :(</p>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}