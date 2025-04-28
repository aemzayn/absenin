import { Link } from "react-router";

export default function RegisterPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle login logic here
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log(formData);

    console.log({
      email,
      password,
    });
  };

  return (
    <form
      className="w-md mx-auto bg-gray-50 p-10 rounded-xl shadow-lg flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <h1 className="text-gray-900 mb-5 text-center">Daftar akun baru</h1>

      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>

      <div>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Nama lengkap
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Kata sandi
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Konfirmasi kata sandi
        </label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>

      <button type="submit">Daftar</button>

      <div className="mt-5 text-center">
        <p className="text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Masuk sekarang
          </Link>
        </p>
      </div>
    </form>
  );
}
