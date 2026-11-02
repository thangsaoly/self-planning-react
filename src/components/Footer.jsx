import { Link, useLocation } from "react-router-dom";

export default function Footer() {
    const { pathname } = useLocation();
    const isHome = pathname === "/";

    const featureHref = isHome ? "#features" : "/#features";
    const contactHref = isHome ? "#Contact" : "/#Contact";

    return (
        <footer className="col-start-1 row-start-3 px-4 w-[98%]">
            <div className="w-full">
                <hr className="w-full h-[2px] bg-gray-200 border-none mb-4" />
                <div className="logo flex mb-4">
                    <Link to="/">
                        <img src="/img/Self-Planning-Logo.png" alt="logo" className="h-12 ml-[15px]" />
                    </Link>
                </div>
                <div
                    className="footer-info flex flex-col md:flex-row items-center justify-evenly gap-8 md:gap-12"
                    id="Contact"
                >
                    <div className="so-me flex flex-col items-center gap-2">
                        <h3 className="text-(--color-text-primary) font-semibold">Follow us on:</h3>
                        <div className="icon flex gap-1">
                            <a
                                href="https://web.facebook.com/profile.php?id=61595772407242"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Self-Planning Travel Planner on Facebook (facebook.com/profile.php?id=61595772407242)"
                                title="Facebook — Self-Planning Travel Planner"
                                className="text-(--color-facebook) hover:text-(--color-primary-blue-light) transition-colors duration-300"
                            >
                                <i className="fi fi-brands-facebook text-5xl m-1.5 cursor-pointer" />
                            </a>
                            <i className="fi fi-brands-telegram text-5xl m-1.5 cursor-pointer" />
                            <a
                                href="https://github.com/thangsaoly/self-planning-react"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Self-Planning Travel Planner on GitHub (github.com/thangsaoly/self-planning-react)"
                                title="GitHub — thangsaoly/self-planning-react"
                                className="text-(--color-github) hover:text-(--color-primary-blue-light) transition-colors duration-300"
                            >
                                <i className="fi fi-brands-github text-5xl m-1.5 cursor-pointer" />
                            </a>
                        </div>
                    </div>
                    <div className="link">
                        <ul className="list-none flex flex-col gap-2.5 items-center justify-center">
                            <li>
                                <Link
                                    to="/"
                                    className="text-(--color-text-primary) no-underline"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="text-(--color-text-primary) no-underline"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <a href={featureHref} className="text-(--color-text-primary) no-underline">
                                    Feature
                                </a>
                            </li>
                            <li>
                                <a href={contactHref} className="text-(--color-text-primary) no-underline">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="img hidden md:flex">
                        <img
                            src="/img/self-service.png"
                            alt="self-service"
                            className="h-[170px] w-[170px] aspect-square"
                        />
                    </div>
                </div>
                <div className="copy-right text-center mb-2">
                    <p className="text-(--color-text-secondary)">
                        © 2025 Self-Planning, All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
