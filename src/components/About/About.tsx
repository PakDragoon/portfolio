import { Container } from "./styles";
import HassanAli from "../../assets/HassanAliProfilePicture.png";
import wordpress from "../../assets/wordpress.svg";
import shopify from "../../assets/shopify.svg";
import htmlIcon from "../../assets/html-icon.svg";
import cssIcon from "../../assets/css-icon.svg";
import jsIcon from "../../assets/js-icon.svg";
import nodeIcon from "../../assets/node-icon.svg";
import reactIcon from "../../assets/react-icon.svg";
import typescriptIcon from "../../assets/typescript-icon.svg";
import vueIcon from "../../assets/vue-icon.svg";
import boostrapIcon from "../../assets/bootstrap-icon.svg";
import ScrollAnimation from "react-animate-on-scroll";

export function About() {
  return (
    <Container id="about">
      <div className="about-text">
        <ScrollAnimation animateIn="fadeInLeft">
          <h2>About me</h2>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.1 * 1000}>
          <p>
            Hello, this is Hassan Ali, a Full Stack Engineer with quite strong JavaScript fundamentals and experience in both the back and frontend. I am passionate about developing scalable, performant, and intuitive applications using modern technologies such as React and Node.js. My passion lies in creating customized solutions for the needs of businesses everywhere, from dynamic web applications to robust SaaS products.
          </p>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.2 * 1000} style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <p>
            Apart from custom development, I bring with me experience in the integration and workflow automation of various CRMs like Monday.com and Make.com to drive operational efficiency. My toolkit includes Docker, Apache Kafka, and Git CI/CD pipelines to guarantee reliable and efficient deployments.</p>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.3 * 1000}>
          <p>
            I look forward to bringing my knowledge and skills into a new opportunity that will go toward contributing to innovative projects, creating meaningful impact.</p>
        </ScrollAnimation>
        <ScrollAnimation animateIn="fadeInLeft" delay={0.4 * 1000}>
          <h3>Here are my main skills:</h3>
        </ScrollAnimation>
        <div className="hard-skills">
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.19 * 1000}>
              <img src={jsIcon} alt="JavaScript" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.14 * 1000}>
              <img src={typescriptIcon} alt="Typescript" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.13 * 1000}>
              <img src={reactIcon} alt="React" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.15 * 1000}>
              <img src={vueIcon} alt="Vue" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.16 * 1000}>
              <img src={nodeIcon} alt="Node" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.17 * 1000}>
              <img src={htmlIcon} alt="Html" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.18 * 1000}>
              <img src={cssIcon} alt="Css" />
            </ScrollAnimation>
          </div>
          <div className="hability">
            <ScrollAnimation animateIn="fadeInUp" delay={0.19 * 1000}>
              <img src={boostrapIcon} alt="bootstrap" />
            </ScrollAnimation>
          </div>
          {/*<div className="hability">*/}
          {/*  <ScrollAnimation animateIn="fadeInUp" delay={0.10 * 1000}>*/}
          {/*    <img src={wordpress} alt="Wordpress" />*/}
          {/*  </ScrollAnimation>*/}
          {/*</div>*/}
          {/*<div className="hability">*/}
          {/*  <ScrollAnimation animateIn="fadeInUp" delay={0.12 * 1000}>*/}
          {/*    <img src={shopify} alt="shopify" />*/}
          {/*  </ScrollAnimation>*/}
          {/*</div>*/}
        </div>
      </div>
      <div className="about-image">
        <ScrollAnimation animateIn="fadeInRight" delay={0.20 * 1000}>
          <img src={HassanAli} alt="Hassan Ali" />
        </ScrollAnimation>
      </div>
    </Container>
  )
}
