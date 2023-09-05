import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import { PostProps } from "../components/Post"
import { Post, PrismaClient } from "@prisma/client"
import { PostCard } from "../components/PostCard"
import { redirect } from "next/navigation";

const Blog = () => {
  redirect('/list/open');
}

export default Blog
