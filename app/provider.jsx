"use client";
import React, { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/services/supabaseClient";

function Provider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const createUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Check if user already exists
        const { data: Users, error } = await supabase
          .from("Users")
          .select("*")
          .eq("email", user?.email);

        if (error) {
          console.error("Error fetching Users:", error);
          return;
        }

        // Ensure Users is an array before accessing its elements
        if (Array.isArray(Users) && Users.length > 0) {
          console.log("User already exists:", Users);
          setUser(Users[0]); // ✅ Set if user exists
        } else {
          const { data, error } = await supabase.from("Users").insert([
            {
              name: user?.user_metadata?.name,
              email: user?.email,
              picture: user?.user_metadata?.picture,
            },
          ]);

          if (error) {
            console.error("Error inserting user:", error);
          } else {
            console.log("User created:", data);
            setUser(data[0]); // ✅ Set after creating
          }
        }
      } catch (err) {
        console.error("Error in createUser:", err);
      }
    };

    createUser();
  }, []);

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () => {
  const context = useContext(UserDetailContext);
  return context;
};
