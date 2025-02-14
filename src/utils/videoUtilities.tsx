import axios from "axios";
import dotenv from "dotenv";
import { Tag } from "./tagsUtilities";
dotenv.config();

export type Video = {
  id: number;
  title: string;
  description: string;
  slug: string;
  content_id: string;
  total_hit: number;
  status: "draft" | "published" | "archived" | "live";
  category_id: number;
  category_name: string;
  category_icon: string;
  created_by: number;
  username: string;
  user_photo: string;
  tags: Tag[];
  created_at: string;
  published_at: string | null;
  updated_at: string;
};

export type Meta = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

export type Response = {
  status?: number;
  message?: string;
  meta?: Meta;
  data?: Video;
  datas?: Video[];
  slug?: string;
  error?: string;
};

export async function handleFetchVideoList(
  currentPage: number,
  limitPage: number,
  selectedStatus: string,
  order: string
): Promise<Response> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL
      }/videos?page=${currentPage}&limit=${limitPage}&status=${selectedStatus.toLowerCase()}&order=${order}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      return {
        status: response.status,
        message: response.data.message,
        meta: response.data.meta,
        datas: response.data.data,
      };
    } else {
      return {
        status: response.status,
        message: response.data.message,
      };
    }
  } catch (err: any) {
    console.error("Error fetching videos:", err.response?.data || err.message);
    return {
      status: err.response.status || 500,
      message: err.response.data.message || "An unexpected error occurred.",
    };
  }
}

export async function handleFetchVideoBySlug(slug: string): Promise<Response> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/view/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      return {
        status: response.status,
        message: response.data.message,
        data: response.data.video,
      };
    } else {
      return {
        status: response.status,
        message: response.data.message,
      };
    }
  } catch (err: any) {
    console.error("Error fetching video:", err.response?.data || err.message);
    return {
      status: err.response.status || 500,
      message: err.response.data.message || "An unexpected error occurred.",
    };
  }
}

export async function handleFetchVideoBySearch(
  searchTerm: string,
  currentPage: number,
  limitPage: number,
  order: string,
  selectedCategory: number,
  selectedStatus: string
): Promise<Response> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL
      }/videos/search?page=${currentPage}&limit=${limitPage}&search=${searchTerm}&category=${selectedCategory}&status=${selectedStatus.toLowerCase()}&order=${order}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        validateStatus: () => true,
      }
    );

    if (response.status === 200) {
      return {
        status: response.status,
        message: response.data.message,
        meta: response.data.meta,
        datas: response.data.data,
      };
    } else {
      return {
        status: response.status,
        message: response.data.message,
      };
    }
  } catch (err: any) {
    console.error("Error fetching video:", err.response?.data || err.message);
    return {
      status: err.response.status || 500,
      message: err.response.data.message || "An unexpected error occurred.",
    };
  }
}

export async function handleAddVideo(
  title: string,
  description: string,
  content_id: string,
  category_id: number,
  tags: Tag[]
): Promise<Response> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/add`,
      {
        title,
        description,
        content_id,
        category_id,
        tags,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return {
      status: response.status,
      message: response.data.message,
    };
  } catch (err: any) {
    console.error("Error saving video:", err.response?.data || err.message);
    return {
      status: err.response.status || 500,
      message: err.response.data.message || "An unexpected error occurred.",
    };
  }
}

export async function handleUpdateVideo(
  videoId: number,
  title: string,
  description: string,
  content_id: string,
  category_id: number,
  tags: Tag[]
): Promise<Response> {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/edit/${videoId}`,
      {
        title,
        description,
        content_id,
        category_id,
        tags,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      return {
        status: response.status,
        message: response.data.message,
        slug: response.data.slug,
      };
    } else {
      return {
        status: response.status,
        message: response.data.message,
      };
    }
  } catch (err: any) {
    console.error("Error saving video:", err.response?.data || err.message);
    return {
      status: err.response.status || 500,
      message: err.response.data.message || "An unexpected error occurred.",
    };
  }
}

export async function handleUpdateVideoStatus(
  videoId: number,
  status: string
): Promise<Response> {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/update-status/${videoId}`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return {
      status: response.status,
      message: response.data.message,
    };
  } catch (err: any) {
    console.error(
      "Error setting video status:",
      err.response?.data || err.message
    );
    return {
      status: err.response.status || 500,
      message: err.response.data.message || "An unexpected error occurred.",
    };
  }
}

export async function handleDeleteVideo(videoId: number): Promise<Response> {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/delete/${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return {
      status: response.status,
      message: response.data.message,
    };
  } catch (err: any) {
    console.error("Error deleting video:", err.response?.data || err.message);
    return {
      status: err.response.status || 500,
      message: err.response.data.message || "An unexpected error occurred.",
    };
  }
}
