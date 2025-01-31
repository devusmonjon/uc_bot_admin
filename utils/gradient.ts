export const gradients = [
    "from-purple-400 via-pink-500 to-red-500",
    "from-green-400 via-teal-500 to-blue-500",
    "from-yellow-400 via-orange-500 to-red-500",
    "from-blue-400 via-indigo-500 to-purple-500",
    "from-red-400 via-pink-500 to-purple-500",
  ]
  
  export function getGradient(index: number): string {
    return gradients[index % gradients.length]
  }
  
  