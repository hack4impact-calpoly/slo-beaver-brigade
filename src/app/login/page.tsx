import React from "react";
import Link from "next/link";

export default function Login() {
  return (
    <div className="">
      <div className="">
        <div className="">
          <div className="">
            <div className="">
              <h1 className=""> Log In</h1>
              <label className="label">
                <span className="">Email</span>
              </label>
              <input
                type="text"
                placeholder="Email"
                className="input input-bordered"
              />
            </div>
            <div className="">
              <label className="label">
                <span className="">Password</span>
              </label>
              <input
                type="text"
                placeholder="Password"
                className="input input-bordered"
              />
              <label className="label">
                <a href="." className="">
                  Forgot password?
                </a>
              </label>
              <label className="label">
                <Link href="/signup" className="">
                  Create new account
                </Link>
              </label>
            </div>
            <div className="">
              <button className="">Log In</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
