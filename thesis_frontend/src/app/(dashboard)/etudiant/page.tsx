"use client"

import { useState, useRef } from "react"
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Layout } from "lucide-react"

export default function StudentDashboard() {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    studentId: "12345",
    profilePicture: null
  })

  const [thesis, setThesis] = useState({
    title: "",
    file: null,
  })

  const [internship, setInternship] = useState({
    company: "",
    address: "",
    supervisor: "",
    startDate: "",
    endDate: "",
  })

  const fileInputRef = useRef(null)

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile({ ...profile, profilePicture: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleThesisChange = (e) => {
    if (e.target.name === "file") {
      setThesis({ ...thesis, file: e.target.files[0] })
    } else {
      setThesis({ ...thesis, [e.target.name]: e.target.value })
    }
  }

  const handleInternshipChange = (e) => {
    setInternship({ ...internship, [e.target.name]: e.target.value })
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    console.log("Profile updated:", profile)
    // Implement API call to update profile
  }

  const handleThesisSubmit = (e) => {
    e.preventDefault()
    console.log("Thesis submitted:", thesis)
    // Implement API call to submit thesis
  }

  const handleInternshipSubmit = (e) => {
    e.preventDefault()
    console.log("Internship info submitted:", internship)
    // Implement API call to submit internship info
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  return (

    <div className="flex-1 space-y-4 p-8 pt-6">

      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight"></h2>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="thesis">Dépôt de Mémoire</TabsTrigger>
          <TabsTrigger value="internship">Stage</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles ici.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.profilePicture} alt="Profile picture" />
                    <AvatarFallback>{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button type="button" onClick={triggerFileInput}>
                      Changer la photo
                    </Button>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="studentId">Numéro étudiant</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    value={profile.studentId}
                    onChange={handleProfileChange}
                  />
                </div>

                <Button type="submit">Mettre à jour le profil</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="thesis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dépôt de Mémoire</CardTitle>
              <CardDescription>
                Déposez votre mémoire ici.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <form onSubmit={handleThesisSubmit}>
                <div className="space-y-1">
                  <Label htmlFor="title">Thème du mémoire</Label>
                  <Input
                    id="title"
                    name="title"
                    value={thesis.title}
                    onChange={handleThesisChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="file">Fichier du mémoire</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    onChange={handleThesisChange}
                  />
                </div>
                <Button type="submit" className="mt-4">Déposer</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="internship" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de Stage</CardTitle>
              <CardDescription>
                Fournissez les détails de votre stage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <form onSubmit={handleInternshipSubmit}>
                <div className="space-y-1">
                  <Label htmlFor="company">Entreprise</Label>
                  <Input
                    id="company"
                    name="company"
                    value={internship.company}
                    onChange={handleInternshipChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={internship.address}
                    onChange={handleInternshipChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="supervisor">Superviseur</Label>
                  <Input
                    id="supervisor"
                    name="supervisor"
                    value={internship.supervisor}
                    onChange={handleInternshipChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={internship.startDate}
                    onChange={handleInternshipChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="endDate">Date de fin</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={internship.endDate}
                    onChange={handleInternshipChange}
                  />
                </div>
                <Button type="submit" className="mt-4">Enregistrer</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}