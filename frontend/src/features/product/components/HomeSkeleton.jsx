const HomeSkeleton = () => {
  return (
    <div className="bg-white min-h-screen animate-pulse">
      {/* Hero Skeleton */}
      <div className="relative w-full h-[90vh] bg-gray-100">

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">

          <div className="w-40 h-3 bg-gray-300 rounded mb-6"></div>

          <div className="w-80 h-14 bg-gray-300 rounded mb-8"></div>

          <div className="w-36 h-12 bg-gray-300 rounded"></div>

        </div>
      </div>

      {/* Products */}
      <div className="px-6 md:px-20 py-20">

        <div className="flex flex-col items-center">

          <div className="w-52 h-8 bg-gray-300 rounded"></div>

          <div className="w-72 h-4 bg-gray-200 rounded mt-5"></div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-16">

          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>

              <div className="w-full h-[320px] bg-gray-200 rounded-lg"></div>

              <div className="mt-5 flex flex-col items-center">

                <div className="w-32 h-4 bg-gray-300 rounded"></div>

                <div className="w-16 h-4 bg-gray-200 rounded mt-3"></div>

                <div className="flex gap-2 mt-4">

                  <div className="w-12 h-8 bg-gray-200 rounded"></div>

                  <div className="w-12 h-8 bg-gray-200 rounded"></div>

                  <div className="w-12 h-8 bg-gray-200 rounded"></div>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default HomeSkeleton;