import Hero from './components/Hero'
import FormAddress from './components/FormAddress'
import {
  Card,
  CardContent
} from "@/app/components/ui/card"

const AppPage = () => {
    return (
      <section>
        <div className="pt-5 m-1 lg:pt-28 sm:pt-16 w-full flex flex-col gap-12 sm:flex-row justify-start sm:justify-evenly">
          <Hero />
          <Card>
            <CardContent>
            <FormAddress />
            </CardContent>
          </Card>
        </div>
      </section>
    )
}
export default AppPage