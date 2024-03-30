import React from "react";
import { Card } from "antd";

const Search = () => {

  return (
    <div>
      <Card>
        <div class="mx-auto bg-white rounded-xl overflow-hidden">
          <div class="md:flex">
            {/* <!-- First Child Element --> */}
            <div class="md:w-1/2 p-5">
              <img
                class="h-100 w-full object-cover md:h-full md:w-48"
                src="https://images.pexels.com/photos/20179666/pexels-photo-20179666/free-photo-of-miracle-experience-balloon-safaris-at-serengeti-and-tarangire-national-park.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Modern building architecture"
              />
            </div>

            {/* <!-- Second Child Element --> */}
            <div class="md:w-1/2 p-5">
              <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                Company retreats
              </div>
              <p class="mt-2 text-slate-500">
                Looking to take your team away on a retreat to enjoy awesome
                food and take in some sunshine? We have a list of places to do
                just that.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Search;
