import Hero from './components/Hero'
import FormAddress from './components/FormAddress'

const AppPage = () => {
    return (
      <section>
        <div className="pt-20 sm:pt-30 w-full h-[860px] flex flex-col sm:flex-row justify-evenly">
          <Hero />
          <FormAddress />
        </div>
        <div>
          
        </div>
      </section>
    )
}
export default AppPage