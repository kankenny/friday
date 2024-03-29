import { useTypedSelector } from "../../../../lib/hooks/redux-hook/useTypedSelector"
import Overview from "../../../ui/Overview"
import RouterLink from "../../../ui/RouterLink"

const PageNotFound = () => {
  const { isLoggedIn } = useTypedSelector((state) => state.auth)

  return (
    <Overview twClasses="my-auto">
      <h1 className="text-2xl font-bold">404 Error: Page Not Found!</h1>
      <p className="text-md">
        It looks like you accessed a non-existent URL. Click{" "}
        <RouterLink
          to={isLoggedIn ? "/timeline" : "/"}
          routerLinkText="here"
          twClasses="text-md text-tertiary hover:text-secondary underline"
        />{" "}
        to go back to the landing page.
      </p>
    </Overview>
  )
}

export default PageNotFound
