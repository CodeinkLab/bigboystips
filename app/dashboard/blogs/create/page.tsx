import CreateBlogClient from "./CreateBlogClient"


export const metadata = {
  title: "Create Blog | BigBoysTips",
  description: "Create a new blog post",
}

export default function CreateBlogPage() {
  return (
    <div className="p-4 lg:p-4  mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <CreateBlogClient />
    </div>
  )
}
