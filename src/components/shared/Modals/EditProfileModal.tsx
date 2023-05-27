import React, { useEffect } from "react";
import { type ModalsProps } from "~/components/shared/Modals/index";
import { HiOutlineCamera, HiOutlineXMark } from "react-icons/hi2";
import ModalTopBar from "~/components/shared/Modals/utils/ModalTopBar";
import Image from "next/image";
import { User } from ".prisma/client";
import ProfileImage from "~/components/shared/ProfileImage";
import { Input, InputAddOn } from "~/components/shared/Modals/utils/Inputs";
import { CDNURL, supabase } from "../../../../supabase";
import { v4 as uuid } from "uuid";
import { notification } from "~/components/shared/Alerts";
import { api } from "~/utils/api";
import { unknown } from "zod";
import LoadingModal from "~/components/shared/LoadingModal";
import trpc from "~/pages/api/trpc/[trpc]";

type EditProfileModalProps = ModalsProps & {
  user: User;
};

const EditProfileModal = ({ setModal, user }: EditProfileModalProps) => {
  const trpcUtils = api.useContext();

  const profileImageRef = React.useRef<HTMLInputElement>(null);
  const backgroundImageRef = React.useRef<HTMLInputElement>(null);

  const [loading, setLoading] = React.useState(false);

  const [backgroundImage, setBackgroundImage] = React.useState<File | null>(
    null
  );
  const [profileImage, setProfileImage] = React.useState<File | null>(null);

  const [form, setForm] = React.useState<{
    name: string;
    tagName: string;
    image: string | null;
    backgroundImage: string | null;
    email: string;
  }>({
    name: user.name ?? "",
    tagName: user.tagName ?? "",
    image: user.image,
    backgroundImage: user.backgroundImage,
    email: user.email ?? "",
  });

  const profileUpdate = api.profile.updateProfile.useMutation({
    onSuccess: async (newProfile) => {
      console.log(newProfile);
      await trpcUtils.users.getUserById.invalidate({ id: user.id });
      setModal(false);
    },
  });

  useEffect(() => {
    if (user.backgroundImage)
      setForm((prev) => ({ ...prev, backgroundImage: user.backgroundImage }));
  }, []);

  useEffect(() => {
    if (user.image) setForm((prev) => ({ ...prev, image: user.image }));
  }, []);

  const uploadBackgroundImage = async (): Promise<string | null> => {
    if (backgroundImage === null) return null;

    const { error, data } = await supabase.storage
      .from("multimedia")
      .upload(`${user.id}_${uuid()}`, backgroundImage);

    if (error) {
      console.log(error);
      return null;
    } else {
      return `${CDNURL}/${data?.path}`;
    }

    return null;
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    if (profileImage === null) return null;

    const { error, data } = await supabase.storage
      .from("multimedia")
      .upload(`${user.id}_${uuid()}`, profileImage);

    if (error) {
      console.log(error);
      return null;
    } else {
      return `${CDNURL}/${data?.path}`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let profileURL: string | null = "";
    let backgroundURL: string | null = "";

    setLoading(true);

    backgroundURL = await uploadBackgroundImage();
    profileURL = await uploadProfileImage();

    if (!form.email || !form.tagName) {
      alert("Please fill all fields");
      return notification("error", "Please fill all fields");
    }

    const updatedProfile: {
      name: string;
      image?: string;
      backgroundImage?: string;
      tagName: string;
      email: string;
    } = {
      name: form.name,
      tagName: form.tagName,
      email: form.email,
    };

    if (profileURL) updatedProfile.image = profileURL;
    if (backgroundURL) updatedProfile.backgroundImage = backgroundURL;

    profileUpdate.mutate(updatedProfile);

    setForm({ ...form, ...updatedProfile });

    setLoading(false);
  };

  const handleUploadBackgroundImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(file);
    }
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  return (
    <>
      {loading && <LoadingModal />}

      <form onSubmit={(e) => void handleSubmit(e)} className="relative">
        <ModalTopBar setModal={setModal} title={"Edit Profile"} save />

        <div className="relative mt-4 h-[260px]">
          <div className="relative h-full">
            <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center gap-4 bg-black bg-opacity-50">
              <div>
                <div
                  className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-neutral-900 transition-all hover:bg-opacity-80"
                  onClick={() => backgroundImageRef.current?.click()}
                >
                  <HiOutlineCamera className="text-3xl" />
                </div>
              </div>
              {form.backgroundImage && (
                <div onClick={() => setBackgroundImage(null)}>
                  <div className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-neutral-900 transition-all hover:bg-opacity-80">
                    <HiOutlineXMark className="text-3xl" />
                  </div>
                </div>
              )}
            </div>

            <div className="relative h-full w-full overflow-hidden rounded-xl">
              {form.backgroundImage && !backgroundImage ? (
                <Image
                  src={form.backgroundImage}
                  alt={form.name ?? "Background image"}
                  fill
                  className="relative object-cover"
                />
              ) : (
                backgroundImage && (
                  <Image
                    src={URL.createObjectURL(backgroundImage)}
                    alt={form.name ?? "Background image"}
                    fill
                    className="relative object-cover"
                  />
                )
              )}
            </div>
          </div>

          <div className="absolute -bottom-12 left-2 z-10 h-32 w-32 overflow-hidden rounded-full">
            <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-10">
              <div
                className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-60 transition-all hover:bg-opacity-80"
                onClick={() => profileImageRef.current?.click()}
              >
                <HiOutlineCamera className="text-3xl" />
              </div>
            </div>
            {form?.image && !profileImage ? (
              <ProfileImage src={form.image ?? ""} size={32} />
            ) : (
              profileImage && (
                <ProfileImage
                  src={URL.createObjectURL(profileImage)}
                  size={32}
                />
              )
            )}
          </div>
          <input
            type="file"
            className="hidden"
            ref={profileImageRef}
            onChange={handleProfileUpload}
          />
          <input
            type="file"
            className="hidden"
            ref={backgroundImageRef}
            onChange={handleUploadBackgroundImage}
          />
        </div>

        <div className="relative mt-16 flex flex-col gap-4">
          <Input
            label="Name"
            defaultValue={form.name ?? ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <InputAddOn
            label="Profile tag"
            defaultValue={form.tagName ?? ""}
            addon="@"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, tagName: e.target.value }))
            }
          />
          <Input
            label="Email"
            type="email"
            defaultValue={form.email ?? ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
      </form>
    </>
  );
};

export default EditProfileModal;
