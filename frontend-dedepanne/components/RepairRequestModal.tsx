"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormItem, FormLabel, FormControl, FormField, FormMessage } from "@/components/ui/form"
import { Wrench, Mail, Phone, MapPin } from "lucide-react"
import { useForm } from "react-hook-form"
import { BUTTON_STYLES } from "@/lib/constants"

const appliances = [
  "Lave-linge",
  "Lave-vaisselle",
  "Réfrigérateur",
  "Four",
  "Micro-ondes",
  "Sèche-linge"
]

export default function RepairRequestModal({ open, onClose, user }) {
  const form = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.addresses[0]?.address_line1 || "",
      city: user.addresses[0]?.city || "",
      appliance: "",
      brand: "",
      model: "",
      description: ""
    }
  })

  const onSubmit = (data) => {
    alert("Demande envoyée !\n" + JSON.stringify(data, null, 2))
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Demander une réparation
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="firstName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )} />
              <FormField name="lastName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )} />
              <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="address" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )} />
              <FormField name="city" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )} />
            </div>
            <FormField name="appliance" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Type d'appareil</FormLabel>
                <FormControl>
                  <select {...field} className="w-full border rounded px-2 py-2">
                    <option value="">Sélectionner</option>
                    {appliances.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="brand" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Marque</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Samsung, Bosch..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="model" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Modèle</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Référence du modèle" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Description du problème</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Décrivez la panne ou le problème rencontré..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="submit" className={`w-full ${BUTTON_STYLES.primary}`}>
                Envoyer la demande
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 