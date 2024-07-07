import Scroll from '@/components/landing-page/Scroll/index';
import Banner from '@/components/landing-page/Banner/index';
import Features from '@/components/landing-page/Administration/index';
import About from '@/components/landing-page/About/index';
import Student from '@/components/landing-page/Expert/index';
import Gallery from '@/components/landing-page/Gallery/index';
import Newsletter from '@/components/landing-page/Newsletter/Newsletter';
import './landingpage-style.css';




export default function Home() {
  return (
    <main>
      <Banner />
      <About />
      <Student />
      <Gallery />
      <Features />
      <Newsletter />
      <Scroll/>
    </main>
  )
}
