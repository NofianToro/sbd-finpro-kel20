const favoriteRepo =
    require('../repositories/favoriteRepository');

const favoriteController = {

    addFavorite: async (req, res) => {

        try {
            const { user_id, food_id } = req.body;
            const favorite =
                await favoriteRepo.addFavorite(
                    user_id,
                    food_id
                );
            res.status(201).json({
                success: true,
                message: 'Favorite added',
                data: favorite
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    },

    removeFavorite: async (req, res) => {
        try {
            const { user_id, food_id } = req.body;
            const favorite =
                await favoriteRepo.removeFavorite(
                    user_id,
                    food_id
                );
            res.status(200).json({
                success: true,
                message: 'Favorite removed',
                data: favorite
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    },

    getFavoritesByUserId: async (req, res) => {
        try {
            const { user_id } = req.params;
            const favorites =
                await favoriteRepo.getFavoritesByUserId(user_id);
            res.status(200).json({
                success: true,
                message: 'Successfully retrieved favorites',
                data: favorites
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }
};

module.exports = favoriteController;