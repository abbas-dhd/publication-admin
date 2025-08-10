import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/prospective-authors/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/prospective-authors/"!</div>
}
