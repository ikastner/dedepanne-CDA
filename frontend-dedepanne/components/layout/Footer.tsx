import { Wrench } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white py-12 md:py-16 px-4 border-t">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wrench className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-cocogoose font-black text-black">
                dédé<span className="text-primary">panne</span>
              </span>
            </div>
            <p className="text-gray-600 font-helvetica">
              Votre partenaire de confiance pour tous vos dépannages d'électroménager.
            </p>
          </div>
          <div>
            <h4 className="font-poppins font-bold text-black mb-4">Services</h4>
            <ul className="space-y-3 text-gray-600 font-helvetica">
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Dépannage
                </Link>
              </li>
              <li>
                <Link href="/reconditioned" className="hover:text-primary transition-colors">
                  Reconditionnés
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Don d'appareils
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-poppins font-bold text-black mb-4">Support</h4>
            <ul className="space-y-3 text-gray-600 font-helvetica">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Garanties
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-poppins font-bold text-black mb-4">Légal</h4>
            <ul className="space-y-3 text-gray-600 font-helvetica">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-gray-600 font-helvetica">
            &copy; 2024{" "}
            <span className="font-cocogoose font-bold text-black">
              dédé<span className="text-primary">panne</span>
            </span>
            . Tous droits réservés.
          </p>
          <div className="flex justify-center mt-6">
            <img src="/mascotte.svg" alt="Mascotte dédépanne" className="h-20 w-auto" />
          </div>
        </div>
      </div>
    </footer>
  )
} 