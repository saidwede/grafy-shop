"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, storage } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Search, Package, User, ChevronRight, Clock, CheckCircle, Truck, Box, Loader2, Camera, Phone, Mail, Lock, AlertCircle, Check } from 'lucide-react';
import { COUNTRIES, getFlagEmoji, Country } from '@/lib/countries';
import ImageCropper from '@/components/Account/ImageCropper';

interface Order {
    id: string;
    date: string;
    total: string;
    status: 'processing' | 'printing' | 'shipped' | 'delivered';
    items: number;
}

const MOCK_ORDERS: Order[] = [
    { id: 'GS-8821', date: '2026-02-15', total: '124.50 €', status: 'delivered', items: 3 },
    { id: 'GS-8942', date: '2026-02-20', total: '89.00 €', status: 'shipped', items: 2 },
    { id: 'GS-9015', date: '2026-02-22', total: '210.00 €', status: 'printing', items: 5 },
];

export default function AccountPage() {
    const { t, locale } = useLanguage();
    const { user, loading, refreshUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

    // Handle tab from query parameter
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'profile' || tab === 'orders') {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Profile State
    const [fullName, setFullName] = useState(user?.displayName || '');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES.find(c => c.code === 'FR') || COUNTRIES[0]);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.photoURL || null);

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Status State
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    // Filtered countries
    const filteredCountries = COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.dial_code.includes(countrySearch)
    );

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Fetch additional user data from Firestore
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const tenantId = auth.tenantId || 'default';
                    const userDoc = await getDoc(doc(db, 'tenants', tenantId, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
                        if (data.countryCode) {
                            const country = COUNTRIES.find(c => c.code === data.countryCode);
                            if (country) setSelectedCountry(country);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }
        };

        if (user) fetchUserData();
    }, [user]);

    // Sync state with user context (name and photo)
    useEffect(() => {
        if (user) {
            if (user.displayName) setFullName(user.displayName);
            if (user.photoURL) setProfilePhoto(user.photoURL);
        }
    }, [user]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = async (croppedImage: string) => {
        setProfilePhoto(croppedImage);
        setShowCropper(false);
        setImageToCrop(null);

        // Auto-save the photo
        if (user) {
            setIsUpdatingProfile(true);
            try {
                // Upload to Firebase Storage
                const tenantId = auth.tenantId || 'default';
                const storageRef = ref(storage, `tenants/${tenantId}/profile-pictures/${user.uid}`);
                
                // Upload Base64 string
                const uploadResult = await uploadString(storageRef, croppedImage, 'data_url');
                const downloadURL = await getDownloadURL(uploadResult.ref);

                // Update Auth Profile with the new URL
                await updateProfile(user, {
                    photoURL: downloadURL
                });

                // Update Firestore Metadata
                await setDoc(doc(db, 'tenants', tenantId, 'users', user.uid), {
                    photoURL: downloadURL,
                    updatedAt: new Date().toISOString()
                }, { merge: true });

                await refreshUser();
                setProfilePhoto(downloadURL); // Update local state with the final URL
                setMessage({ type: 'success', text: locale === 'fr' ? 'Photo mise à jour !' : 'Photo updated successfully!' });
            } catch (err: any) {
                console.error("Storage upload error:", err);
                setMessage({ type: 'error', text: err.message });
            } finally {
                setIsUpdatingProfile(false);
            }
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsUpdatingProfile(true);
        setMessage(null);

        try {
            // Update Auth Profile
            await updateProfile(user, {
                displayName: fullName,
                photoURL: profilePhoto
            });

            // Update Firestore Metadata with multi-tenancy isolation
            const tenantId = auth.tenantId || 'default';
            await setDoc(doc(db, 'tenants', tenantId, 'users', user.uid), {
                displayName: fullName,
                email: user.email,
                photoURL: profilePhoto,
                phoneNumber: phoneNumber,
                countryCode: selectedCountry.code,
                dialCode: selectedCountry.dial_code,
                tenantId: tenantId,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            await refreshUser();
            setMessage({ type: 'success', text: locale === 'fr' ? 'Profil mis à jour !' : 'Profile updated successfully!' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user.email) return;

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: locale === 'fr' ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.' });
            return;
        }

        setIsUpdatingPassword(true);
        setMessage(null);

        try {
            const credential = EmailAuthProvider.credential(user.email, oldPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setMessage({ type: 'success', text: locale === 'fr' ? 'Mot de passe mis à jour !' : 'Password updated successfully!' });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    const getStatusStyles = (status: Order['status']) => {
        switch (status) {
            case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
            case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'printing': return 'bg-purple-50 text-purple-700 border-purple-100';
            default: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
        }
    };

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'delivered': return <CheckCircle size={14} />;
            case 'shipped': return <Truck size={14} />;
            case 'printing': return <Box size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <main className="min-h-screen bg-gray-50/50 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center gap-8 bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50 flex items-center justify-center shrink-0">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={32} className="text-gray-200" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter uppercase mb-2">
                            {user.displayName || t('account_title')}
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            {locale === 'fr' ? 'Bienvenue dans votre espace personnel' : 'Welcome to your personal space'} • {user.email}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Navigation Sidebar */}
                    <aside className="lg:w-64 shrink-0">
                        <nav className="space-y-2 sticky top-24">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase  tracking-tighter transition-all ${activeTab === 'orders' ? 'bg-black text-white shadow-xl shadow-black/10' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                            >
                                <Package size={20} />
                                {t('account_orders')}
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase  tracking-tighter transition-all ${activeTab === 'profile' ? 'bg-black text-white shadow-xl shadow-black/10' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                            >
                                <User size={20} />
                                {t('account_profile')}
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {message && (
                            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                                <p className="text-sm font-bold">{message.text}</p>
                            </div>
                        )}

                        {activeTab === 'orders' ? (
                            <div className="space-y-6">
                                {MOCK_ORDERS.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-xl shadow-black/5 group hover:border-black/10 transition-all"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-6">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                    {t('order_number')}
                                                </p>
                                                <h3 className="text-xl font-black text-black">{order.id}</h3>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                    {t('order_date')}
                                                </p>
                                                <p className="font-bold text-gray-700">{order.date}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                    {t('order_total')}
                                                </p>
                                                <p className="font-black text-black">{order.total}</p>
                                            </div>

                                            <div>
                                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {t(`status_${order.status}`)}
                                                </div>
                                            </div>

                                            <Link
                                                href={`/account/orders/${order.id}`}
                                                className="flex items-center gap-2 font-black uppercase  tracking-tighter text-black group-hover:translate-x-1 transition-transform"
                                            >
                                                {t('order_view_details')}
                                                <ChevronRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-12 pb-20">
                                {/* Profile Info */}
                                <section className="bg-white rounded-[40px] border border-black/5 p-8 md:p-12 shadow-2xl shadow-black/5">
                                    <div className="flex flex-col md:flex-row gap-12 items-start">
                                        {/* Avatar Column */}
                                        <div className="relative group shrink-0 mx-auto md:mx-0">
                                            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-50 rounded-full overflow-hidden border-4 border-white shadow-xl flex items-center justify-center relative">
                                                {profilePhoto ? (
                                                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={48} className="text-gray-300" />
                                                )}
                                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <Camera className="text-white" size={24} />
                                                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                                                </label>
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-black text-white p-2.5 rounded-full shadow-lg">
                                                <Camera size={14} />
                                            </div>
                                        </div>

                                        {/* Form Column */}
                                        <div className="flex-1 w-full max-w-lg space-y-8">
                                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                                <div className="grid grid-cols-1 gap-6">
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Full Name</label>
                                                        <div className="relative">
                                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                            <input
                                                                type="text"
                                                                value={fullName}
                                                                onChange={(e) => setFullName(e.target.value)}
                                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                                                                placeholder="John Doe"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Email Address</label>
                                                        <div className="relative">
                                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                            <input
                                                                type="email"
                                                                value={user.email || ''}
                                                                disabled
                                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-gray-400 cursor-not-allowed"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Phone Number</label>
                                                        <div className="flex gap-3 relative">
                                                            {/* Country Dropdown */}
                                                            <div className="relative shrink-0">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                                                    className="h-full px-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-2 hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <span className="text-xl">{getFlagEmoji(selectedCountry.code)}</span>
                                                                    <span className="text-sm font-bold">{selectedCountry.dial_code}</span>
                                                                </button>

                                                                {showCountryDropdown && (
                                                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-black/5 rounded-[32px] shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-200">
                                                                        {/* Search Input */}
                                                                        <div className="p-3 border-b border-black/5">
                                                                            <div className="relative">
                                                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                                                <input
                                                                                    type="text"
                                                                                    autoFocus
                                                                                    value={countrySearch}
                                                                                    onChange={(e) => setCountrySearch(e.target.value)}
                                                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                                                                                    placeholder="Search country..."
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="max-h-60 overflow-y-auto p-1 scrollbar-hide">
                                                                            {filteredCountries.map((c) => (
                                                                                <button
                                                                                    key={`${c.code}-${c.dial_code}`}
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setSelectedCountry(c);
                                                                                        setShowCountryDropdown(false);
                                                                                        setCountrySearch('');
                                                                                    }}
                                                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-2xl transition-colors text-left"
                                                                                >
                                                                                    <span className="text-xl">{getFlagEmoji(c.code)}</span>
                                                                                    <div className="flex flex-col">
                                                                                        <span className="text-xs font-black text-black tracking-tight">{c.name}</span>
                                                                                        <span className="text-[10px] font-bold text-gray-400 tracking-widest">{c.dial_code}</span>
                                                                                    </div>
                                                                                </button>
                                                                            ))}
                                                                            {filteredCountries.length === 0 && (
                                                                                <div className="px-4 py-8 text-center">
                                                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No matching countries</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex-1 relative">
                                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                                <input
                                                                    type="tel"
                                                                    value={phoneNumber}
                                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                                                                    placeholder="00 00 00 00"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isUpdatingProfile}
                                                    className="px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {isUpdatingProfile ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </section>

                                {/* Change Password */}
                                <section className="bg-white rounded-[40px] border border-black/5 p-8 md:p-12 shadow-2xl shadow-black/5">
                                    <div className="max-w-lg">
                                        <div className="mb-10">
                                            <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-2">Change Password</h3>
                                            <p className="text-gray-500 font-medium text-sm">Update your account password for better security.</p>
                                        </div>

                                        <form onSubmit={handleUpdatePassword} className="space-y-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Current Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                        <input
                                                            type="password"
                                                            value={oldPassword}
                                                            onChange={(e) => setOldPassword(e.target.value)}
                                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                                                            placeholder="••••••••"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">New Password</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                            <input
                                                                type="password"
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                                                                placeholder="••••••••"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Confirm New Password</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                            <input
                                                                type="password"
                                                                value={confirmPassword}
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                                                                placeholder="••••••••"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isUpdatingPassword}
                                                className="px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {isUpdatingPassword ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
                                            </button>
                                        </form>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showCropper && imageToCrop && (
                <ImageCropper
                    image={imageToCrop}
                    onCropComplete={handleCropComplete}
                    onCancel={() => {
                        setShowCropper(false);
                        setImageToCrop(null);
                    }}
                />
            )}
        </main>
    );
}
