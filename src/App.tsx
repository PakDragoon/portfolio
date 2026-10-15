import Nav from "./components/Nav";
import EvalBar from "./components/EvalBar";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Games from "./components/Games";
import Principles from "./components/Principles";
import Puzzle from "./components/Puzzle";
import Contact from "./components/Contact";

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <EvalBar />
      <main id="main">
        <Hero />
        <Story />
        <Games />
        <Principles />
        <Puzzle />
        <Contact />
      </main>
    </>
  );
}
