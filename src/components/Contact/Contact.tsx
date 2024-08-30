import { Container } from "./styles";
import emailIcon from "../../assets/email-icon.svg";
import phoneIcon from "../../assets/phone-icon.svg"
import { Form } from "../Form/Form";


export function Contact(){

  return(
    <Container id="contact">
        <header>
            <h2>Contact</h2>
            <p>Interested in discussing how my skills can benefit your team?</p>
            <p>Contact me to schedule an interview or for any further inquiries.</p>
        </header>
        <div className="contacts">
            <div>
                <a href="mailto:hassan748_7@hotmail.com"><img src={emailIcon} alt="Email"/></a>
                <a href="mailto:hassan748_7@hotmail.com">hassan748_7@hotmail.com</a>
            </div>
        <div>
            <a href="tel:+971585736113"><img src={phoneIcon} alt="Phone No" /></a>
            <a href="tel:+971585736113">(+971) 585736113</a>
        </div>  
      </div>
      <Form></Form>
    </Container>
  )
}